const fsp = require("./io/fsp.js")

const store = {}; 
const commands = {
    // Load commands dynamically from respective files 
    init: async () => {
        const dirname = `${__dirname}/commands`;
        const files = await fsp.readdir(dirname);
        files.forEach(file => {
            const obj = require(`${dirname}/${file}`);
            const command = (...args) => obj.run(...args);
            command.enabled = true;

            // Import fields from command object into the function
            Object.assign(command, obj);
            if(!command.enabled) return;

            delete command.run; // Run is no longer needed
            command.aliases.forEach(alias => {
                console.log(`Loading command: ${alias}`);
                store[alias] = command;
            })
        });
    },
    get: (alias) => store[alias],
    getAll: () => store
}

module.exports = commands;