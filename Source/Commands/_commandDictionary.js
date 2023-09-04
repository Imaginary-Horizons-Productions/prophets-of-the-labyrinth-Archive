const CommandSet = require('../../Classes/CommandSet.js');

// A maximum of 25 command sets are supported by /commands to conform with MessageEmbed limit of 25 fields
exports.commandSets = [
	new CommandSet("Game Commands", "Here are the commands you'll use when playing Prophets of the Labyrinth", false, ["delve.js", "invite.js", "party-stats.js", "inspect-self.js", "ping.js", "give-up.js"]),
	new CommandSet("Informational Commands", "Use these commands to look up information about Prophets of the Labyrinth!", false, ["manual.js", "armory.js", "consumable-info.js", "commands.js", "stats.js", "feedback.js", "version.js", "support.js"]),
	new CommandSet("Configuration Commands", "These commands change how the bot operates on your server. They require bot management permission (a role above the bot's roles).", true, ["reset.js"]),
	// moderationCommands
];

exports.commandFiles = exports.commandSets.reduce((allFiles, set) => allFiles.concat(set.fileNames), []);
const commandDictionary = {};
exports.slashData = [];

for (const file of exports.commandFiles) {
	const command = require(`./${file}`);
	commandDictionary[command.name] = command;
	exports.slashData.push(command.data.toJSON());
}

exports.getCommand = function (commandName) {
	return commandDictionary[commandName];
}
