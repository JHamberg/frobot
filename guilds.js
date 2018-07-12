const fsp = require("./io/fsp.js");
const commands = {};

const dir = `${__dirname}/guild_commands`;
const getFilePath = (guild) => `${dir}/${guild.name}-${guild.id}`;
const getCommands = (guild) => commands[guild.id];

const init = async (guilds) => {
    guilds.forEach(async guild => {
        const file = getFilePath(guild);
        await createIfNotExists(dir, {dir: true});
        await createIfNotExists(file);

        const content = await fsp.readFile(file, "utf-8") || "{}";
        commands[guild.id] = JSON.parse(content);
    });
}

const addCommand = async (guild, command, output) => {
    const list = commands[guild.id];
    if(list[command]) throw "This command already exists";

    list[command] = output;
    const file = getFilePath(guild);
    await fsp.writeFile(file, JSON.stringify(list));
}

// This should eventually reside somewhere else
const createIfNotExists = async (target, options={dir: false}) => {
    const exists = await fsp.exists(target);
    if(exists) return; // Exit early if target exists
    if(options.dir) {
        await fsp.mkdir(target);
    } else {
        const fd = await fsp.open(target, "w");
        await fsp.close(fd);
    }
}

module.exports = {init, addCommand, getCommands};