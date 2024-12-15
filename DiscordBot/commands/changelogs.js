module.exports = {
    name: 'changelogs',
    description: 'Show the changelog for the bot',
    async execute(interaction) {
        console.log('Changelog command executed'); // Debugging step to confirm command execution

        try {
            const changelog = `
            **Vanguard Stats Bot Changelog**

            **v1.0.1** - Initial Release (lv 5 start)
            - Basic bot functionality with stats tracking for Minecraft users.
            - Fetch and display user stats like Combat, Movement, and Building.
            - Commands: /stats [username], /changelogs.

            **v1.2.** - Rewrite (lv 3 fix)
            - rewrote the code so its not just 1 big file
            - added username sanitisation
            - added username heads
            - removed herobrine

            **v1.2.2** - Button Navigation for Stats (lv 1 fix)
            - fixed navigation buttons for switching between Combat, Movement, and Building pages.
            - fixed Stats refresh functionality. (i think)

            **v1.2.3** - Minor Fixes (lv 1 fix)
            - Fixed an issue where combat button did not re-enable properly after switching pages.
            - Improved error handling for stat fetching.
            `;

            console.log('Sending changelog to user'); // Debugging step to check if reply is reached

            // Respond with the changelog
            await interaction.reply({
                content: changelog,
                ephemeral: true,
            });

            console.log('Changelog sent successfully');
        } catch (error) {
            console.error('Error sending changelog:', error);
            await interaction.reply({
                content: 'There was an error processing your request.',
                ephemeral: true,
            });
        }
    },
};
