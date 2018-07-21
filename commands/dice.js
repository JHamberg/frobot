const crypto = require("crypto");
const utils = require("../utils.js");

const dice = {
    aliases: ["dice", "throw", "roll", "rolls"],
    description: "Throw a truly random dice",
    run: async (msg, args, client) => {
        // Generate a uniform distribution of truly random rolls
        const output = await msg.channel.send(":hourglass: Rolling the dice…");

        const amount = +args[0] || 1;
        const rolls = Array(amount).fill().map(() => {
            const buffer = new Uint8Array(1);

            // Since six is not a power of two, we need rejection sampling    
            let candidate;
            do {
                const bytes = crypto.randomBytes(buffer.length);
                buffer.set(bytes);
                candidate = bytes[0] % 8 + 1; // Power of two
            } while (candidate > 6);

            // Use the first random number in bounds
            return candidate; 
        });

        // Summarize more than 100 rolls
        const author = msg.author.username;
        const results = rolls.length > 100 ? dist(rolls) : rolls.map(utils.bold);
        await output.edit(`:game_die: **${author}** rolls ${results.join(", ")}.`);
    }
}

// Format the distribution of dice rolls
const dist = (rolls) => {
    const counts = utils.countByIdentity(rolls);
    return Object.entries(counts).map(([face, count]) => {
        const percentage = utils.round(count / rolls.length * 100, 2);
        return `**${face}**: ${count} (${percentage}%)`;
    });
}

module.exports = dice;