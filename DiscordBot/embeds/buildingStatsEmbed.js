const { EmbedBuilder } = require('discord.js');

module.exports = (username, stats, userAvatarUrl) => {
    return new EmbedBuilder()
        .setColor('#FFD700')
        .setThumbnail(userAvatarUrl)
        .setTitle(`Building Stats for ${username}`)
        .addFields(
            { name: '⛏️ Netherrack Mined', value: `7 Days: ${stats['Netherrack Mined']?.sevenDays || '0'}\n30 Days: ${stats['Netherrack Mined']?.thirtyDays || '0'}\nTotal: ${stats['Netherrack Mined']?.total || '0'}`, inline: true },
            { name: '💥 TNT Placed', value: `7 Days: ${stats['TNT Placed']?.sevenDays || '0'}\n30 Days: ${stats['TNT Placed']?.thirtyDays || '0'}\nTotal: ${stats['TNT Placed']?.total || '0'}`, inline: true }
        )
        .setFooter({ text: 'Building stats collected from 6b6t.org | Vanguard Stats bot | v1.2.3 |' })
        .setTimestamp();
};
