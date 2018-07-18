const guilds = require("../guilds.js");

const location = {
    aliases: ["location", "place"],
    description: "Allows adding custom locations for the command",
    run: async (msg, args, client) => {
        if (!args || args.length < 1) throw "Invalid arguments!";
        const guild = msg.channel.guild;
        const alias = args[0].toLowerCase();

        // Handle special case where we want to add a location
        if (alias === "add" && args.length == 4) {
            const [alias, lat, lon] = args.slice(1);
            const location = {
                latitude: lat.toLowerCase(),
                longitude: lon.toLowerCase()
            };
            await guilds.addLocation(guild, alias.toLowerCase(), location);
            await msg.channel.send(":white_check_mark: Location added!");
            return;
        }

        // Normally, just look up coordinates for the alias 
        const locations = await guilds.getLocations(guild);
        const location = locations[alias];

        // Send the coordinates if there was a match
        await msg.channel.send(location ? 
            `${location.latitude}° N, ${location.longitude}° E`: "Unknown location!");
    }
}

module.exports = location;