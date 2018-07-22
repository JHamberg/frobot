const {identity} = require("../utils.js");

const remove = {
    aliases: ["remove", "rm"],
    description: "Removes your last message",
    run: async (msg, args, client) => {
        const {author, id, channel, createdTimestamp} = msg;
        await msg.delete(); // Delete command immediately
        const which = args[0] || -1;

        // Find the message to delete    
        const [message] = channel.messages
            .filter(m => m.author.id === author.id)
            .filter(m => m.createdTimestamp < createdTimestamp)
            .filter(m => m.id !== id)
            .map(identity) 
            .slice(which);

        // Delete the message if it exists
        if (message) await message.delete();
    }
}

module.exports = remove;