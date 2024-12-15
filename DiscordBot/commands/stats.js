const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('Fetch stats for a Minecraft user')
        .addStringOption((option) =>
            option
                .setName('username')
                .setDescription('Minecraft username')
                .setRequired(true)
        ),
    async execute(interaction) {
        const { sanitizeUsername } = require('../utils/sanitizeUsername');
        const fetchStats = require('../utils/fetchStats');
        const combatStatsEmbed = require('../embeds/combatStatsEmbed');
        const movementStatsEmbed = require('../embeds/movementStatsEmbed');
        const buildingStatsEmbed = require('../embeds/buildingStatsEmbed');

        const rawUsername = interaction.options.getString('username');
        const username = sanitizeUsername(rawUsername);

        if (!username) {
            await interaction.reply({
                content: 'Invalid username. Please use a valid Minecraft username.',
                ephemeral: true,
            });
            return;
        }

        await interaction.reply(`Fetching stats for **${username}**... Please wait.`);
        try {
            const stats = await fetchStats(username);
            if (!stats) throw new Error('Stats not found.');

            await interaction.editReply({
                content: `Stats for **${username}**:`,
                embeds: [combatStatsEmbed(stats, username)],
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
            await interaction.editReply(`❌ Could not fetch stats for **${username}**.`);
        }
    },
};
