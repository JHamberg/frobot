const Discord = require('discord.js');
const fsp = require("./io/fsp");
const guilds = require("./guilds.js");

// Load environment variables from .env file
require('dotenv').config();

const client = new Discord.Client();
const prefix = process.env.PREFIX;
let commands = [];

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
        command.enabled = true;

        // Import fields from command object into the function
        Object.assign(command, obj);
        if(!command.enabled) return;

        delete command.run; // Run is no longer needed
        command.aliases.forEach(alias => {
            console.log(`Loading command: ${alias}`);
            commands[alias] = command;
        })
    });

    // Initialize guild service (currently used for custom commands)
    await guilds.init(client.guilds);
    console.log("All commands loaded, ready to rock!");
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

    // Check custom commands if no official one found
    const guild = msg.channel.guild;
    const guildCommands = guilds.getCommands(guild);
    if(guildCommands) { 
        const output = guildCommands[name];
        if(!output) return; 
        await msg.channel.send(output);
    }
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
client.login(process.env.DISCORD_TOKEN);