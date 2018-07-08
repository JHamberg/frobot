const fs = require("fs");

// This should happen asynchronously in the future
let data = fs.readFileSync(__dirname + "/kaomojis.txt", "utf8");
let kaomojis = data.split("\n");

module.exports = kaomojis;