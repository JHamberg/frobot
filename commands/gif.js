const request = require("request-promise-native");

const gif = {
    aliases: ["gif", "webm"],
    description: "Look up a random GIF from Giphy",
    enabled: !!process.env.GIPHY_TOKEN, // Need an API key for this command
    run: async (msg, args, client) => {
        const search = args ? encodeURI(args.join(" ")) : "";
        const options = {
            url: `http://api.giphy.com/v1/gifs/random?tag=${search}`,
            json: true,
            qs: {
                api_key: process.env.GIPHY_TOKEN,
                rating: "g" // Content rating
            }
        }
        const response = await request(options);
        const url = response.data.image_url;  
        await msg.channel.send(url ? url : "No results found!");
    }
}

module.exports = gif;