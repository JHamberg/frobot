const request = require("request-promise-native");
const utils = require("../utils.js")

const currentDate = new Date();
const shortYear = currentDate.getFullYear().toString().substr(-2);
const eventsUrl = "https://www.assembly.org/media/uploads/schedule/summer18/events.json";

const notEnded = (event) => event.end > new Date().getTime();
const ongoing = (event) => event.start < new Date().getTime();

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
        const active = events.map(format).filter(notEnded);
        const current = active.filter(ongoing);
        
        const location = args[0] || "stage";
        let selected = location.toLowerCase() !== "all" 
            ? current.filter(x => x.location_key == location)
            : current;
        
        if (!selected) {
            await msg.channel.send(":x: Invalid event location!");
            return;
        }

        const results = selected.map(event => {
            const now = new Date().getTime();
            const { name, location_key } = event;
            const remaining = event.end - now;
            const location = locations[location_key].name;
            const [hours, minutes] = utils.timefy(remaining);
            return hours !== 0 
                ? `**${name}** \n${location}: ${hours}h ${minutes}min remaining`
                : `**${name}** \n${location}: ${minutes}min remaining`;
        })

        await msg.channel.send(results.join("\n"));
    }
}

module.exports = assembly;