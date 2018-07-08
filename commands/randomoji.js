const kaomojis = require("../kaomojis.js");

const randomoji = {
    aliases: ["randomoji"],
    description: "Outputs a random kaomoji",
    run: (msg, args, client) => {
        const idx = Math.floor(Math.random() * kaomojis.length);
        msg.channel.send(kaomojis[idx]);
    }
}

module.exports = randomoji;