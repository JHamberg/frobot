const random = require("../random.js");
const utils = require("../utils.js");

const dice = {
    aliases: ["dice", "throw", "roll", "rolls"],
    description: "Roll a truly random dice",
    run: async (msg, args, client) => {
        const author = msg.author.username;
        const output = await msg.channel.send(":hourglass: Rolling the dice…");

        // Generate a uniform distribution of truly random rolls
        const amount = +args[0] || 1;
        const rolls = utils.fill(amount, () => random.int256(1, 6));

        // Print distribution for more than 100 rolls
        const results = rolls.length > 100 ? utils.dist(rolls) : rolls.map(utils.bold);
        await output.edit(`:game_die: **${author}** rolls ${results.join(", ")}.`);
    }
}

module.exports = dice;