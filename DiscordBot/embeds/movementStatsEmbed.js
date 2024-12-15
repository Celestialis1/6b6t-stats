const { EmbedBuilder } = require('discord.js');

module.exports = (username, stats, userAvatarUrl) => {
    return new EmbedBuilder()
        .setColor('#3389FF')
        .setThumbnail(userAvatarUrl)
        .setTitle(`Movement Stats for ${username}`)
        .addFields(
            { name: '🚶 Blocks Walked', value: `7 Days: ${stats['Blocks Walked']?.sevenDays || '0'}\n30 Days: ${stats['Blocks Walked']?.thirtyDays || '0'}\nTotal: ${stats['Blocks Walked']?.total || '0'}`, inline: true },
            { name: '✈️ Blocks Flown', value: `7 Days: ${stats['Blocks Flown']?.sevenDays || '0'}\n30 Days: ${stats['Blocks Flown']?.thirtyDays || '0'}\nTotal: ${stats['Blocks Flown']?.total || '0'}`, inline: true },
            { name: '🏃 Jumps', value: `7 Days: ${stats['Jumps']?.sevenDays || '0'}\n30 Days: ${stats['Jumps']?.thirtyDays || '0'}\nTotal: ${stats['Jumps']?.total || '0'}`, inline: true }
        )
        .setFooter({ text: 'Movement stats collected from 6b6t.org | Vanguard Stats bot | v1.2.3 |' })
        .setTimestamp();
};
