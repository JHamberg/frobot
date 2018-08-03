const Discord = require('discord.js');
const request = require("request-promise-native");
const similarity = require("string-similarity");
const moment = require("moment");

const year = new Date().getFullYear();
const shortYear = year.toString().substr(-2);
const url = `https://www.assembly.org/media/uploads/schedule/summer${shortYear}/events.json`;

const assembly = {
    aliases: ["assembly", "asm"],
    description: `Displays ongoing and upcoming events for #ASMPARTY${shortYear}`,
    run: async (msg, args) => {
        const { locations, events } = await request.get({ url, json: true });
        let area = (args[0] || "stage").toLowerCase();
        const count = args[1] || 5;

        // Find the best fuzzy match if the location does not exist
        if (!locations[area]) {
            // Under the hood, this uses Sørensen–Dice coefficient
            const { bestMatch } = similarity.findBestMatch(area, Object.keys(locations));
            const { target, rating } = bestMatch;

            // Minimum rating we can consider a match
            if (rating < 0.3) {
                await msg.channel.send(`:x: Failed to find area ${area}!`);
                return;
            }
            area = target;
        }

        // Format and filter events of interest
        const [ongoing, upcoming] = events.reduce((res, raw) => {
            const [ongoing, upcoming] = res;
            const { name, location_key: key, start_time, end_time } = raw;
            const now = moment();

            // Filter out events in the wrong area
            if (key !== area) return res;

            // Only include events that have not ended
            if (moment(end_time).isAfter(now)) {
                const start = moment(start_time);
                const time = start.format("HH:mm");

                // Separate ongoing and upcoming events
                return start.isBefore(now)
                    ? [[...ongoing, name], upcoming]
                    : [ongoing, [...upcoming, `\`${time}\` - ${name}`]];
            }

            return res;
        }, [[], []]);

        // Exit early if there are no results
        if ([ongoing, upcoming].every(arr => arr.length === 0)) {
            await msg.channel.send(`:x: No events found for ${area}`);
            return;
        }

        // Format the output as rich embed
        const embed = new Discord.RichEmbed()
            .setColor(0x000000)
            .setAuthor(`ASSEMBLY Summer ${year} - Schedule`, "https://i.imgur.com/T3TyVku.png")
            .setThumbnail("https://i.imgur.com/gzizQQ5.png")
            .setTitle(`**${locations[area].name}**`)
            .setURL(`https://www.assembly.org/summer${shortYear}/schedule`)
            .addField("Ongoing", ongoing.length > 0 ? ongoing.join("\n") : "No current events.")
            .addField("Upcoming", upcoming.length > 0 ? upcoming.slice(0, count).join("\n") : "No upcoming events.")
            .setTimestamp(new Date())
            .setFooter("© ASSEMBLY");

        await msg.channel.send({ embed });
    }
};

module.exports = assembly;
