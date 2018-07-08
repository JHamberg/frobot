const Discord = require('discord.js');
const fs = require("fs");
const {promisify} = require('util');

// Extended fs with promise functionality
const fsp = {
    readdir: promisify(fs.readdir),
    mkdir: promisify(fs.mkdir),
    exists: promisify(fs.exists),
    readFile: promisify(fs.readFile),
    open: promisify(fs.open),
    close: promisify(fs.close)
}

// Load environment variables from .env file
require('dotenv').config();

const client = new Discord.Client();
const prefix = process.env.PREFIX;
let commands = [];
let guildcommands = [];

// Execute when bot is loaded
client.on("ready", async () => {
    console.log(`Bot started with ${client.users.size} users on ${client.guilds.size} servers!`);
    client.user.setActivity(process.env.STATUS, {type: "WATCHING"});

    // Load commands dynamically from respective files 
    const dirname = `${__dirname}/commands`;
    const files = await fsp.readdir(dirname);
    files.forEach(file => {
        const obj = require(`${dirname}/${file}`);
        const command = (...args) => obj.run(...args);
        Object.assign(command, obj);
        delete command.run; // Run is no longer needed
        command.aliases.forEach(alias => {
            commands[alias] = command;
        })
    });

    // Load guild specific custom commands
    const guilddir = `${__dirname}/guild_commands`;
    let exists = await fsp.exists(guilddir);
    if(!exists) await fsp.mkdir(guilddir);

    client.guilds.forEach(async guild => {
        const guildfile = `${guilddir}/${guild.name}-${guild.id}`;
        const exists = await fsp.exists(guildfile);
        if(!exists) {
            // Make sure a file exists for each guild
            const fd = await fsp.open(guildfile, "w");
            await fsp.close(fd);
        }
        const content = await fsp.readFile(guildfile, "utf-8") || "{}";
        const commands = JSON.parse(content);
        guildcommands[guild.id] = commands;
    });
});

// Execute on message
client.on("message", async msg => {
    // Ignore messages from other bots and/or without prefix
    if(msg.author.bot) return;
    if(!msg.content.includes(prefix)) return;
    
    // Split the command from its arguments
    const args = msg.content.slice(prefix.length).trim().split(/ +/g);
    const name = args.shift().toLowerCase();
    console.log(`Received command: ${name}`);

    // Find the command module and call it
    const command = commands[name];
    if(command) {
        command(msg, args, client);
        return;
    }

    // Check custom commands if default no found
    const guildcommand = guildcommands[msg.channel.guild.id];
    if(!guildcommand) return;
    const reply = guildcommand[name];
    if(!reply) return; 

    await msg.channel.send(reply);
});

// Handle server join
client.on("guildCreate", guild => {
    console.log(`Bot joined ${guild.name} with ${guild.memberCount} members`);
    console.log(`Now serving ${client.guilds.size} servers`);
});
  
// Handle server leave
client.on("guildDelete", guild => {
    console.log(`Bot left ${guild.name}`);
    console.log(`Now serving ${client.guilds.size} servers`);
});

// Start the bot
client.login(process.env.TOKEN);