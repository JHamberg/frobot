const commands = require("../commands.js");

const help = {
    aliases: ["help", "commands"],
    description: "Prints a list of all available commands",
    run: async (msg, args, client) => {
        if (!args) throw "Invalid arguments!";
        if (args.length > 0) {
            await msg.channel.send("Under construction!");
            return;
        } 
        
        // Find the longest command, then map into padded names and descriptions
        const all = commands.getAll();
        const longest = Object.keys(all).map(x => x.length).reduce((a, b) => Math.max(a, b));
        const list = Object.entries(all).map(([key, command]) => {
            const paddedKey = key.padEnd(longest);
            return `!${paddedKey} ${command.description}`;
        });

        // Wrap in a code block for visual formatting
        const output = `\`\`\`${list.join("\n")}\`\`\``;
        await msg.channel.send(`Here are all the available commands:${output}`);
    }
}

module.exports = help;