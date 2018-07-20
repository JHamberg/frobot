const leave = {
    aliases: ["leave", "bye", "adios"],
    description: "Make frobot leave the channel",
    run: async (msg, args, client) => {
        await msg.channel.send("Bye :(");
        await msg.channel.guild.leave();
    }
}

module.exports = leave;