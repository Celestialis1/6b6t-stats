module.exports = {
    once: true,
    async execute(client) {
        console.log(`${client.user.tag} is online!`);
        client.user.setPresence({
            activities: [{ name: 'Minecraft Stats | /stats', type: 3 }],
            status: 'online',
        });
    },
};
