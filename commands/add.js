const guilds = require("../guilds.js");

const add = {
    aliases: ["add", "addcommand"],
    description: "Add a custom server-wide command.",
    run: async (msg, args, client) => {
        const guild = msg.channel.guild;

        // Validate and parse args
        if(!args || args.length < 2) return;
        const name = args[0];
        const output = args.slice(1).join(" ");

        // Remove unnecessary command prefix
        if(name.startsWith(process.env.PREFIX)){
            name = name.slice(1);
        }

        // Ensure the command does not already exist
        const commands = guilds.getCommands(guild);
        if(commands[name]) {
            await msg.channel.send(`Command ${process.env.PREFIX}${name} already exists!`);
            return;
        } 

        // Add the command
        await guilds.addCommand(guild, name, output);
        await msg.channel.send("Command added!");
    }
};

module.exports = add;