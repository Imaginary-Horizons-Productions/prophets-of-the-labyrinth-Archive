const fs = require('fs');
const CommandSet = require('../../Classes/CommandSet.js');

// A maximum of 25 command sets are supported by /commands to conform with MessageEmbed limit of 25 fields
let generalCommands = new CommandSet("Game Commands", "Here are the commands you'll use when playing Dungeon Tamers", false, ["delve.js", "party-stats.js", "delver-stats.js", "give-up.js"]);
let infoCommands = new CommandSet("Informational Commands", "Use these commands to look up information about Dungeon Tamers!", false, ["about.js", "stats.js", "feedback.js"])
let configCommands = new CommandSet("Configuration Commands", "These commands change how the bot operates on your server. They require bot management permission (a role above the bot's roles).", true, ["reset.js"])
// let moderationCommands = new CommandSet("Moderation Commands", "These commands allow bot managers to counteract bad behavior. They require bot management permission (a role above the bot's roles).", true, [])

exports.commandSets = [
	generalCommands,
	infoCommands,
	configCommands,
	// moderationCommands
];

const commandFiles = this.commandSets.reduce((allFiles, set) => allFiles.concat(set.fileNames), []);
exports.commandDictionary = {};
exports.slashData = [];

for (const file of commandFiles) {
	const command = require(`./${file}`);
	exports.commandDictionary[command.name] = command;
	exports.slashData.push(command.data.toJSON());
}
