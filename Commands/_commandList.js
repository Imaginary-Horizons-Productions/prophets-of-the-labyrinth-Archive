const fs = require('fs');
const CommandSet = require('../Classes/CommandSet.js');

// The help command supports 25 command sets to conform with MessageEmbed limit of 25 fields
let generalCommands = new CommandSet("Game Commands", "Here are the commands you'll use when playing Dungeon Tamers", false, ["delve.js"]);
let infoCommands = new CommandSet("Informational Commands", "Use these commands to look up information about Dungeon Tamers!", false, ["about.js", "stats.js"])
let configCommands = new CommandSet("Configuration Commands", "These commands change how the bot operates on your server. They require bot management permission (a role above the bot's roles).", true, ["setup.js"])
// let moderationCommands = new CommandSet("Moderation Commands", "These commands allow bot managers to counteract bad behavior. They require bot management permission (a role above the bot's roles).", true, [])

exports.commandSets = [
	generalCommands,
	infoCommands,
	configCommands,
	// moderationCommands
];

var commandFileNames = [];
this.commandSets.forEach(set => {
	commandFileNames = commandFileNames.concat(set.fileNames);
})
const commandFiles = fs.readdirSync('./Commands').filter(file => file.endsWith('.js') && commandFileNames.includes(file));
exports.commandDictionary = {};
exports.slashData = [];

for (const file of commandFiles) {
	const command = require(`./${file}`);
	exports.commandDictionary[command.name] = command;
	exports.slashData.push(command.data.toJSON());
}
