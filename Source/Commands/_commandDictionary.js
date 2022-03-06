const CommandSet = require('../../Classes/CommandSet.js');

// A maximum of 25 command sets are supported by /commands to conform with MessageEmbed limit of 25 fields
exports.commandSets = [
	new CommandSet("Game Commands", "Here are the commands you'll use when playing Prophets of the Labyrinth", false, ["delve.js", "invite.js", "party-stats.js", "delver-stats.js", "ping.js", "give-up.js"]),
	new CommandSet("Informational Commands", "Use these commands to look up information about Prophets of the Labyrinth!", false, ["manual.js", "stats.js", "feedback.js", "version.js"]),
	new CommandSet("Configuration Commands", "These commands change how the bot operates on your server. They require bot management permission (a role above the bot's roles).", true, ["reset.js"]),
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
