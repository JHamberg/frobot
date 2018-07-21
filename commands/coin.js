const random = require("../random.js");
const utils = require("../utils.js");

const dice = {
    aliases: ["coin", "toss", "flip"],
    description: "Flip a coin",
    run: async (msg, args, client) => {
        const output = await msg.channel.send(":hourglass: Flipping a coin…");
        const author = msg.author.username;
        const amount = +args[0] || 1;
        
        // Create a function to generate a truly random flip
        const flip = () => random.int256(0, 1) ? "heads" : "tails";

        // Perform as many flips as requested
        const flips = utils.fill(amount, flip);
        const results = flips.length > 10 ? utils.dist(flips) : flips.map(utils.bold);

        // Pretty print the results
        const suffix = amount > 1 ? ` **${amount}** times` : "";
        await output.edit(`:four_leaf_clover: **${author}** flips a coin${suffix}: ${results.join(", ")}!`);
    }
}

module.exports = dice;