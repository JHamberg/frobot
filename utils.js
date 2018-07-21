const cardinals = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
const distFormat = (elem, count, p) => `**${elem}**: ${count} (${p}%)`;

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
    dist: (arr, format = distFormat, precision = 2) => {
        const counts = utils.countByIdentity(arr);
        return Object.entries(counts).map(([elem, count]) => {
            const percentage = utils.round(count / arr.length * 100, precision);
            return format(elem, count, percentage);
        });
    },
    fill: (times, obj) => {
        return Array(times).fill().map(() => {
            return typeof obj === "function" ? obj() : obj;
        });
    }
}

module.exports = utils;