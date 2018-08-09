const request = require("request-promise-native");
const similarity = require("string-similarity");
const utils = require("../utils");

const getTopGames = async () => {
    const response = await request({
        url: "https://api.twitch.tv/helix/games/top",
        headers: { "Client-ID": process.env.TWITCH_ID },
        json: true,
        qs: { first: 100 }
    });

    const result = response.data.reduce((res, { id, name }) => {
        res[name.toLowerCase()] = id;
        const acronym = utils.acronym(name).toLowerCase();

        // Higher popularity games reserve acronyms first
        if (acronym.length > 1 && !res[acronym]) {
            res[acronym] = id;
        }
        return res;
    }, {});

    // Manual override
    result.hs = "138585";
    return result;
};

const getTopStreams = async id => (
    request({
        url: "https://api.twitch.tv/helix/streams",
        headers: { "Client-ID": process.env.TWITCH_ID },
        json: true,
        qs: { game_id: id, first: 5 }
    })
);

const getGame = async (name) => {
    const { id } = request({
        url: "https://api.twitch.tv/helix/games",
        headers: { "Client-ID": process.env.TWITCH_ID },
        json: true,
        qs: { name }
    });
    return id;
};

const fuzzyFind = (topGames, name) => {
    const { bestMatch } = similarity.findBestMatch(name, Object.keys(topGames));
    const { target, rating } = bestMatch;
    return rating >= 0.3
        ? topGames[target]
        : undefined;
};

const getUser = async (id) => {
    const { data } = await request({
        url: "https://api.twitch.tv/helix/users",
        headers: { "Client-ID": process.env.TWITCH_ID },
        json: true,
        qs: { id }
    });
    return data[0];
};

const twitch = {
    aliases: ["twitch", "tw", "streams", "streamers"],
    description: "Shows top streams for the given category",
    enabled: !!process.env.TWITCH_ID,
    run: async (msg, args) => {
        if (!args || args.length === 0) {
            // TODO: Fetch top streams on the whole site
            await msg.channel.send(":warning: Under construction! Please provide a category for now");
        }
        const topGames = await getTopGames();

        const query = args.join(" ");
        const name = query.toLowerCase();

        const id = topGames[name] || await getGame(name) || fuzzyFind(topGames, name);
        if (!id) {
            await msg.channel.send(`:x: Failed to find category **${name}**!`);
            return;
        }
        const { data } = await getTopStreams(id);
        const pad = data.reduce((res, stream) => {
            const count = stream.viewer_count.toString().length;
            return Math.max(res, count);
        }, 0);
        const streams = await Promise.all(data.map(async (stream) => {
            const { title, user_id, viewer_count } = stream;
            const { display_name } = await getUser(user_id);
            const count = viewer_count.toString().padEnd(pad, ' ');
            return `\`(♟${count})\`  **${display_name}** - ${title} `;
        }));

        await msg.channel.send(streams.join("\n"));
    }
};

module.exports = twitch;
