const request = require("request-promise-native");
const moment = require("moment");
const utils = require("../utils.js")

const currentDate = new Date();
const shortYear = currentDate.getFullYear().toString().substr(-2);
const eventsUrl = "https://www.assembly.org/media/uploads/schedule/summer18/events.json";

const notEnded = (event) => event.end > new Date().getTime();
const ongoing = (event) => event.start < new Date().getTime();
const upcoming = (event) => event.start > new Date().getTime();

const format = (event) => {
    const { name, location_key } = event;
    const start = utils.toEpoch(event.start_time);
    const end = utils.toEpoch(event.end_time);
    return { name, start, end, location_key };
}

const assembly = {
    aliases: ["assembly", "asm"],
    description: `Displays ongoing and upcoming events for Assembly${shortYear}`,
    run: async (msg, args, client) => {
        
        const json = await request.get({url: eventsUrl, json: true});
        const { locations, events } = json;

        const location = args[0] || "stage";
        let limited = location.toLowerCase() !== "all"
            ? events.filter(event => event.location_key == location)
            : events;
        
        if (!limited) {
            await msg.channel.send(":x: Invalid event location!");
            return;
        }

        const active = limited.map(format).filter(notEnded);
        const current = active.filter(ongoing);    

        let next;
        if (current.length <= 1) {
            const lowest = active
                .filter(upcoming)
                .reduce((prev, curr) => (prev.start < curr.start ? prev : curr), Infinity)
            const { name, start } = lowest;
            const time = moment(start).format("hh:mm");
            next = { name, time };
        }

        const results = current.map(event => {
            const { name, location_key } = event;
            const location = locations[location_key].name;

            const now = new Date().getTime();
            const remaining = event.end - now;
            const [hours, minutes] = utils.timefy(remaining);

            return hours !== 0 
                ? `**${name}** \n${location} (${hours}h ${minutes}min remaining)`
                : `**${name}** \n${location} (${minutes}min remaining)`;
        })

        let output = results.join("\n\n"); 
        if (next) {
            output = output ? `${output}\n\n` : ""; 
            output = `${output}**Next event at ${next.time}**:\n${next.name}`;
        }

        await msg.channel.send(output);
    }
}

module.exports = assembly;