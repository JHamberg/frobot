const fs = require("fs");
const {promisify} = require('util');

// Basic wrapper to promisify selected fs functions 
const fsp = {
    readdir: promisify(fs.readdir),
    mkdir: promisify(fs.mkdir),
    exists: promisify(fs.exists),
    writeFile: promisify(fs.writeFile),
    readFile: promisify(fs.readFile),
    open: promisify(fs.open),
    close: promisify(fs.close)
}

module.exports = fsp;