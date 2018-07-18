const cardinals = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];

const utils = {
    capitalize: (str) => {
        return str[0].toUpperCase() + str.slice(1);
    },
    emojify: (str) => `:${str}:`,
    compassify: (deg) => {
        const idx = Math.floor((deg / 22.5) + 0.5);
        return cardinals[idx % 16];
    },
    clockify: (ts) => {
        const date = new Date(ts);
        const options = {
            hour: "numeric",
            minute: "numeric",
            hour12: "true"
        }
        return date.toLocaleString("en-US", options)
    }
}

module.exports = utils;