const Command = require('../../Classes/Command.js');

const options = [];
module.exports = new Command("delver-stats", "Get your adventure-specific stats for the thread's adventure", false, false, options);

// imports from files that depend on /Config
let
	// adventureDAO
	getAdventure,
	// combatantDAO
	delverStatsBuilder;
module.exports.injectConfig = function (isProduction) {
	({ getAdventure } = require('../adventureDAO.js').injectConfig(isProduction));
	({ delverStatsBuilder } = require('../combatantDAO.js').injectConfig(isProduction));
	return this;
}

module.exports.execute = (interaction) => {
	// Show the delver stats of the user
	const adventure = getAdventure(interaction.channel.id);
	if (adventure) {
		let delver = adventure.delvers.find(delver => delver.id === interaction.user.id);
		if (delver) {
			interaction.reply(delverStatsBuilder(delver))
				.catch(console.error);
		} else {
			interaction.reply({ content: "You are not a part of this adventure.", ephemeral: true });
		}
	} else {
		interaction.reply({ content: "This channel doesn't appear to be an adventure's thread.", ephemeral: true });
	}
}
