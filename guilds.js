const fsp = require("./io/fsp.js");
const guilds = {};

const dir = `${__dirname}/guild_commands`;
const getFilePath = (guild) => `${dir}/${guild.name}-${guild.id}`;
const getGuilds = () => guilds;
const getCommand = (guild, name) => guilds[guild.id].commands[name];
const getCommands = (guild) => guilds[guild.id].commands;
const getLocations = (guild) => guilds[guild.id].locations;
const defaultStructure = {commands: {}, locations: {}};

const init = async (servers) => {
    await servers.forEach(load);
}

const load = async (guild) => {
    const file = getFilePath(guild);
    await createIfNotExists(dir, {dir: true});
    await createIfNotExists(file);

    const content = await fsp.readFile(file, "utf-8");
    guilds[guild.id] = content ? JSON.parse(content) : defaultStructure;
}

const addCommand = async (guild, command, output) => {
    const list = guilds[guild.id].commands;
    if(list[command]) throw "This command already exists";
    guilds[guild.id].commands[command] = output;
    await save(guild);
}

const addLocation = async (guild, name, location) => {
    // For now, allow overwrites to existing locations
    guilds[guild.id].locations[name] = location; 
    await save(guild);
}

const save = async (guild) => {
    const file = getFilePath(guild);
    await fsp.writeFile(file, JSON.stringify(guilds[guild.id], null, 2));
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

module.exports = {init, load, addCommand, getCommands, addLocation, getLocations, getGuilds, getCommand};