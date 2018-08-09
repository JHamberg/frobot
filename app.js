const Discord = require('discord.js');
const similarity = require("string-similarity");
const guilds = require("./guilds.js");
const commands = require("./commands.js");

// Load environment variables from .env file
require('dotenv').config();

const client = new Discord.Client();
const prefix = process.env.PREFIX;

// Execute when bot is loaded
client.on("ready", async () => {
    console.log(`Bot started with ${client.users.size} users on ${client.guilds.size} servers!`);
    client.user.setActivity(process.env.STATUS, { type: "WATCHING" });

    // Initialize global and guild-specific commands
    await commands.init();
    await guilds.init(client.guilds);
    console.log("All commands loaded, ready to rock!");
});

// Execute on message
client.on("message", async (msg) => {
    // Ignore messages from other bots and/or without prefix
    if (msg.author.bot) return;
    if (!msg.content.startsWith(prefix)) return;

    // Split the command from its arguments
    const args = msg.content.slice(prefix.length).trim().split(/ +/g);
    const name = args.shift().toLowerCase();
    console.log(`Received command: ${name}`);

    // Find the command module and call it
    const command = commands.get(name);
    if (command) {
        command(msg, args, client);
        return;
    }

    // Check custom commands if no official one found
    const { guild } = msg.channel;
    const output = guilds.getCommand(guild, name);
    if (output) {
        await msg.channel.send(output);
        return;
    }

    // Try to suggest a fuzzy match when the command is not found
    const candidates = Object.keys(commands.getAll());
    const { bestMatch } = similarity.findBestMatch(name, candidates);
    const { target: suggestion, rating } = bestMatch;
    console.log(`${suggestion} at ${rating}`);

    const error = rating < 0.3 // Only accept sensible suggestions
        ? `:warning: Command **${name}** not found. Try again.`
        : `:bulb: Did you mean **${suggestion}**?`;

    await msg.channel.send(error);
});

// Handle server join
client.on("guildCreate", async (guild) => {
    await guilds.load(guild);
    console.log(`Bot joined ${guild.name} with ${guild.memberCount} members`);
    console.log(`Now serving ${client.guilds.size} servers`);
});

// Handle server leave
client.on("guildDelete", (guild) => {
    console.log(`Bot left ${guild.name}`);
    console.log(`Now serving ${client.guilds.size} servers`);
});

// Start the bot
client.login(process.env.DISCORD_TOKEN);
