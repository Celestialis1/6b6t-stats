require('dotenv').config();
const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');
const chalk = require('chalk');
const figlet = require('figlet'); // ASCII art
const statsCommand = require('./commands/stats');
const changelogsCommand = require('./commands/changelogs');
const interactionCreateEvent = require('./events/interactionCreate');
const readyEvent = require('./events/ready');

// Configurations
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

// Initialize client
const discordClient = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
    ],
});

// Initialize REST API to register commands
const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

// Clear the console and display ASCII art
console.clear();
figlet('Vanguards 6b6t stats', (err, data) => {
    if (err) {
        console.log(chalk.red('❌ Error generating ASCII banner.'));
        return;
    }
    console.log(chalk.cyan.bold(data));
    console.log(chalk.green('| ✅ | Vanguard Bot Online.'));
    console.log(chalk.yellow('| 🔧 | Preparing commands for registration.'));
    console.log(chalk.blue('| 🔄 | Refreshing application (/) commands.'));
});

//--------------------------------------
//  DISCORD CLIENT SETUP
//--------------------------------------

discordClient.once('ready', async () => {
    console.log(chalk.green('[INFO] Discord bot is online and ready!'));
    console.log(chalk.yellow(`[INFO] ${discordClient.user.tag} is now online.`));

    // Set bot activity
    try {
        await discordClient.user.setPresence({
            activities: [
                { name: 'Minecraft Stats | /stats for details', type: 3 }, // Watching
                { name: '6b6t.org Stats', type: 3 }, // Watching
                { name: 'Your K/D Ratio | /stats [username]', type: 3 }, // Watching
            ],
            status: 'online',
        });
        console.log(chalk.green('| ✅ | Bot activity set successfully.'));
    } catch (error) {
        console.error(chalk.red('| ❌ | Error setting bot presence:', error));
    }

    // Define the commands to be registered
    const commands = [
        {
            name: 'stats',
            description: 'Fetch stats for a Minecraft user',
            options: [
                {
                    name: 'username',
                    type: 3, // STRING type
                    description: 'Minecraft username',
                    required: true,
                },
            ],
        },
        {
            name: 'changelogs',
            description: 'Show the changelog for the bot',
        },
    ];

    try {
        console.log(chalk.blue('| 🔄 | Registering commands...'));
        await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });
        console.log(chalk.green('| ✅ | Commands registered successfully.'));
    } catch (error) {
        console.error(chalk.red('| ❌ | Failed to register commands:', error));
    }

    // Final display after a short delay
    setTimeout(() => {
        console.clear();
        figlet('Vanguard Bot', (err, data) => {
            if (err) {
                console.log(chalk.red('❌ Error generating ASCII banner.'));
                return;
            }
            console.log(chalk.cyan.bold(data));
            console.log(chalk.green('Vanguard Bot is Ready'));
        });
    }, 5000);
});

//--------------------------------------
//           BOT LOGIN
//--------------------------------------

discordClient.login(DISCORD_TOKEN).then(() => {
    console.log(chalk.green('| ✅ | Successfully logged in.'));
}).catch((error) => {
    console.error(chalk.red('| ❌ | Failed to log in:', error));
});

// Register events
discordClient.on('interactionCreate', interactionCreateEvent.execute);
discordClient.on('ready', readyEvent.execute);
