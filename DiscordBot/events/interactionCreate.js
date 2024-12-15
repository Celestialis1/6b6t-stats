const { ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require('discord.js');
const fetchStats = require('../utils/fetchStats');
const sanitizeUsername = require('../utils/sanitizeUsername');
const createCombatEmbed = require('../embeds/combatStatsEmbed');
const createMovementEmbed = require('../embeds/movementStatsEmbed');
const createBuildingEmbed = require('../embeds/buildingStatsEmbed');
const changelogsCommand = require('../commands/changelogs');

const userStatsMap = new Map();

const hasEmbedPermissions = (interaction) => {
    if (!interaction.guild) {
        return true;
    }
    const botMember = interaction.guild.members.me;
    return botMember.permissions.has(PermissionsBitField.Flags.EmbedLinks);
};

const sendStatsToDM = async (user, username, stats, embeds) => {
    try {
        const userAvatarUrl = `https://mc-heads.net/head/${username}`;
        await user.send({
            content: `Stats for **${username}**:`,
            embeds,
        });
        return true;
    } catch (error) {
        console.error(`Error sending stats to DMs for ${username}:`, error);
        return false;
    }
};

module.exports = {
    async execute(interaction) {
        if (interaction.isCommand()) {
            const { commandName } = interaction;

            if (commandName === 'stats') {
                const rawUsername = interaction.options.getString('username');
                const username = sanitizeUsername(rawUsername);

                if (!username) {
                    await interaction.reply({
                        content: 'Invalid username. Please use a valid Minecraft username.',
                        ephemeral: true,
                    });
                    return;
                }

                await interaction.reply({
                    content: `Fetching stats for **${username}**... Please wait.`,
                    ephemeral: true,
                });

                let stats;
                try {
                    stats = await fetchStats(username);
                } catch (error) {
                    console.error('Error while fetching stats:', error);
                    await interaction.followUp({
                        content: `❌ Error occurred while fetching stats for **${username}**.`,
                        ephemeral: true,
                    });
                    return;
                }

                if (!stats) {
                    await interaction.followUp({
                        content: `❌ Could not retrieve stats for **${username}**.`,
                        ephemeral: true,
                    });
                    return;
                }

                const userAvatarUrl = `https://mc-heads.net/head/${username}`;
                const combatStatsEmbed = createCombatEmbed(username, stats, userAvatarUrl);
                const movementStatsEmbed = createMovementEmbed(username, stats, userAvatarUrl);
                const buildingStatsEmbed = createBuildingEmbed(username, stats, userAvatarUrl);

                const embeds = [combatStatsEmbed, movementStatsEmbed, buildingStatsEmbed];

                if (hasEmbedPermissions(interaction)) {
                    const actionRow = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setCustomId(`combatPage|${username}`)
                            .setLabel('Combat')
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(true),
                        new ButtonBuilder()
                            .setCustomId(`movementPage|${username}`)
                            .setLabel('Movement')
                            .setStyle(ButtonStyle.Primary),
                        new ButtonBuilder()
                            .setCustomId(`buildingPage|${username}`)
                            .setLabel('Building')
                            .setStyle(ButtonStyle.Primary),
                        new ButtonBuilder()
                            .setCustomId(`refreshStats|${username}`)
                            .setLabel('Refresh Stats')
                            .setStyle(ButtonStyle.Primary)
                    );

                    await interaction.followUp({
                        content: `Stats for **${username}**:`,
                        embeds: [combatStatsEmbed],
                        components: [actionRow],
                    });

                    userStatsMap.set(username, {
                        combatStatsEmbed,
                        movementStatsEmbed,
                        buildingStatsEmbed,
                        actionRow,
                    });
                } else {
                    const dmSuccess = await sendStatsToDM(interaction.user, username, stats, embeds);
                    if (dmSuccess) {
                        await interaction.followUp({
                            content: 'I could not send the stats in this server. I’ve sent them to your DMs instead.',
                            ephemeral: true,
                        });
                    } else {
                        await interaction.followUp({
                            content: 'I could not send the stats in this server or in your DMs. Please check my permissions and your DM settings.',
                            ephemeral: true,
                        });
                    }
                }
            }

            if (commandName === 'changelogs') {
                if (hasEmbedPermissions(interaction)) {
                    await changelogsCommand.execute(interaction);
                } else {
                    try {
                        await changelogsCommand.executeAsDM(interaction.user);
                        await interaction.reply({
                            content: 'I could not send changelogs in this server. I’ve sent them to your DMs instead.',
                            ephemeral: true,
                        });
                    } catch (dmError) {
                        console.error('Error sending changelogs to DMs:', dmError);
                        await interaction.reply({
                            content: 'I could not send the changelogs in this server or in your DMs. Please check my permissions and your DM settings.',
                            ephemeral: true,
                        });
                    }
                }
            }
        }

        if (interaction.isButton()) {
            const [action, ...usernameParts] = interaction.customId.split('|');
            const username = usernameParts.join('|'); // Reconstruct username

            const statsData = userStatsMap.get(username);
            if (!statsData) {
                await interaction.update({
                    content: `❌ No stats found for **${username}**.`,
                });
                return;
            }

            const { combatStatsEmbed, movementStatsEmbed, buildingStatsEmbed, actionRow } = statsData;

            const updatedActionRow = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId(`combatPage|${username}`)
                    .setLabel('Combat')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(action === 'combatPage'),
                new ButtonBuilder()
                    .setCustomId(`movementPage|${username}`)
                    .setLabel('Movement')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(action === 'movementPage'),
                new ButtonBuilder()
                    .setCustomId(`buildingPage|${username}`)
                    .setLabel('Building')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(action === 'buildingPage'),
                new ButtonBuilder()
                    .setCustomId(`refreshStats|${username}`)
                    .setLabel('Refresh Stats')
                    .setStyle(ButtonStyle.Primary)
            );

            if (action === 'combatPage') {
                await interaction.update({ embeds: [combatStatsEmbed], components: [updatedActionRow] });
            } else if (action === 'movementPage') {
                await interaction.update({ embeds: [movementStatsEmbed], components: [updatedActionRow] });
            } else if (action === 'buildingPage') {
                await interaction.update({ embeds: [buildingStatsEmbed], components: [updatedActionRow] });
            } else if (action === 'refreshStats') {
                try {
                    const stats = await fetchStats(username);
                    const userAvatarUrl = `https://mc-heads.net/head/${username}`;
                    const newCombatStatsEmbed = createCombatEmbed(username, stats, userAvatarUrl);
                    const newMovementStatsEmbed = createMovementEmbed(username, stats, userAvatarUrl);
                    const newBuildingStatsEmbed = createBuildingEmbed(username, stats, userAvatarUrl);

                    userStatsMap.set(username, {
                        combatStatsEmbed: newCombatStatsEmbed,
                        movementStatsEmbed: newMovementStatsEmbed,
                        buildingStatsEmbed: newBuildingStatsEmbed,
                        actionRow: updatedActionRow,
                    });

                    await interaction.update({
                        content: `Refreshing stats for **${username}**...`,
                        embeds: [newCombatStatsEmbed],
                        components: [updatedActionRow],
                    });
                } catch (error) {
                    console.error('Error refreshing stats:', error);
                    await interaction.update({
                        content: '❌ Error occurred while refreshing stats.',
                    });
                }
            }
        }
    },
};
