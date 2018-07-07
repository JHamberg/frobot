const Discord = require('discord.js');
require('dotenv').config()

const client = new Discord.Client();
const prefix = process.env.PREFIX;

client.on("ready", () => {
    console.log(`Bot started with ${client.users.size} users!`);
    client.user.setActivity(process.env.STATUS);
});

client.on("message", async msg => {
    // Ignore messages from other bots and/or without prefix
    if(msg.author.bot) return;
    if(!msg.content.includes(prefix)) return;
    
    const args = msg.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    switch(cmd){
        case "randomoji":
            msg.channel.send("Under construction");
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