const { EmbedBuilder } = require('discord.js');

module.exports = (username, stats, userAvatarUrl) => {
    return new EmbedBuilder()
        .setColor('#FF5733')
        .setThumbnail(userAvatarUrl)
        .setTitle(`Combat Stats for ${username}`)
        .addFields(
            { name: '🕒 Playtime', value: `7 Days: ${stats['Playtime']?.sevenDays}\n30 Days: ${stats['Playtime']?.thirtyDays}\nTotal: ${stats['Playtime']?.total}`, inline: true },
            { name: '💀 Kills', value: `7 Days: ${stats['Kills']?.sevenDays}\n30 Days: ${stats['Kills']?.thirtyDays}\nTotal: ${stats['Kills']?.total}`, inline: true },
            { name: '☠️ Deaths', value: `7 Days: ${stats['Deaths']?.sevenDays}\n30 Days: ${stats['Deaths']?.thirtyDays}\nTotal: ${stats['Deaths']?.total}`, inline: true },
            { name: '⚔️ K/D Ratio', value: `7 Days: ${stats['K/D Ratio']?.sevenDays}\n30 Days: ${stats['K/D Ratio']?.thirtyDays}\nTotal: ${stats['K/D Ratio']?.total}`, inline: true },
            { name: '💣 End Crystals Placed', value: `7 Days: ${stats['End Crystals Placed']?.sevenDays}\n30 Days: ${stats['End Crystals Placed']?.thirtyDays}\nTotal: ${stats['End Crystals Placed']?.total}`, inline: true },
            { name: '🍎 Enchanted Golden Apples Eaten', value: `7 Days: ${stats['Enchanted Golden Apples Eaten']?.sevenDays || '0'}\n30 Days: ${stats['Enchanted Golden Apples Eaten']?.thirtyDays || '0'}\nTotal: ${stats['Enchanted Golden Apples Eaten']?.total || '0'}`, inline: true }
        )
        .setFooter({ text: 'Combat stats collected from 6b6t.org | Vanguard Stats bot | v1.2.3 |' })
        .setTimestamp();
};
