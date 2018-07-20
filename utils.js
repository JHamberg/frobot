const cardinals = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];

const utils = {
    emojify: (str) => `:${str}:`,
    round: (num, n) => +(Math.round(`${num}e${n}`) + `e-${n}`),
    bold: (str) => `**${str}**`,
    capitalize: (str) => {
        return str[0].toUpperCase() + str.slice(1);
    },
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
    },
    countByIdentity: (arr) => {
        return arr.reduce((res, elem) => {
            res[elem] ? res[elem]++ : res[elem] = 1;
            return res;
        }, {});
    },
}

module.exports = utils;