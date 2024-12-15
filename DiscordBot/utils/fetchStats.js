const axios = require('axios');
const cheerio = require('cheerio');
const chalk = require('chalk');

const fetchStats = async (username) => {
    const url = `https://www.6b6t.org/en/stats/${username}`;
    let stats = {};

    try {
        console.log(chalk.yellow(`Fetching stats for username: ${username}`));
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        let kills7d, deaths7d, kills30d, deaths30d, killsTotal, deathsTotal;

        $('tr').each((index, element) => {
            const statName = $(element).find('p.my-auto').text().trim();
            const statValues = $(element).find('td').map((i, td) => $(td).text().trim()).get();

            if (statName && statValues.length >= 3) {
                const cleanedStatValues = statValues.slice(1); // Remove duplicate statName
                stats[statName] = {
                    sevenDays: cleanedStatValues[0] || 'N/A',
                    thirtyDays: cleanedStatValues[1] || 'N/A',
                    total: cleanedStatValues[2] || 'N/A',
                };

                if (statName === 'Kills') {
                    kills7d = parseInt(cleanedStatValues[0] || 0);
                    kills30d = parseInt(cleanedStatValues[1] || 0);
                    killsTotal = parseInt(cleanedStatValues[2] || 0);
                }
                if (statName === 'Deaths') {
                    deaths7d = parseInt(cleanedStatValues[0] || 0);
                    deaths30d = parseInt(cleanedStatValues[1] || 0);
                    deathsTotal = parseInt(cleanedStatValues[2] || 0);
                }
            }
        });

        stats['K/D Ratio'] = {
            sevenDays: deaths7d > 0 ? (kills7d / deaths7d).toFixed(2) : 'N/A',
            thirtyDays: deaths30d > 0 ? (kills30d / deaths30d).toFixed(2) : 'N/A',
            total: deathsTotal > 0 ? (killsTotal / deathsTotal).toFixed(2) : 'N/A',
        };

        return stats;
    } catch (error) {
        console.error(chalk.red('Error fetching stats:', error.message));
        return null;
    }
};

module.exports = fetchStats;
