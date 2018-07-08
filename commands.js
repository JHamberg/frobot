const commands = {
    ping: {
        description: "Tests server latency",
        handler: require("./ping.js"),
        permission: "*"
    },
    randomoji: {
        description: "Prints a random kaomoji",
        execute: require("./randomoji.js"),
        permission: "*"
    }
}

module.exports = commands;