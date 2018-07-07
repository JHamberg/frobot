const Discord = require('discord.js');
const fs = require("fs");
require('dotenv').config();

const client = new Discord.Client();
const prefix = process.env.PREFIX;
let kaomojis = [];

client.on("ready", () => {
    console.log(`Bot started with ${client.users.size} users on ${client.guilds.size} servers!`);
    client.user.setActivity(process.env.STATUS, {
        type: "WATCHING"
    });

    // Load available kaomojis
    fs.readFile(__dirname + "/kaomojis.txt", "utf8", (err, contents) => {
        if(err) throw err;
        kaomojis = contents.split("\n");
    });
});

client.on("guildCreate", guild => {
    console.log(`Bot joined ${guild.name} with ${guild.memberCount} members`);
    console.log(`Now serving ${client.guilds.size} servers`);
});
  
client.on("guildDelete", guild => {
    console.log(`Bot left ${guild.name}`);
    console.log(`Now serving ${client.guilds.size} servers`);
});

client.on("message", async msg => {
    // Ignore messages from other bots and/or without prefix
    if(msg.author.bot) return;
    if(!msg.content.includes(prefix)) return;
    
    // Split the command from its arguments
    const args = msg.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    console.log(`Received command: ${cmd}`);

    // Process the command
    switch(cmd) {
        case "list":
            const list = kaomojis.join("\n");
            msg.channel.send(`Available kaomojis:\`\`\`\n${list}\n\`\`\``);
            break;
        case "randomoji":
            const idx = Math.floor(Math.random() * kaomojis.length);
            msg.channel.send(kaomojis[idx]);
            break;
        case "latency":
        case "delay":
        case "ping":
            const output = await msg.channel.send("Waiting for response to ping..");
            const latency = output.createdTimestamp - msg.createdTimestamp;
            output.edit(`Bot latency is ${latency}ms, API latency is ${client.ping}ms`);
            break;
    };
});

client.login(process.env.TOKEN);