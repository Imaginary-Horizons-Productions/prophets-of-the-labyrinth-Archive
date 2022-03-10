const Command = require('../../Classes/Command.js');

const options = [];
module.exports = new Command("reset", "Recreate the PotL category and central text channel and reset player scores", true, false, options);

// imports from files that depend on /Config
let guildSetup, resetScores;
module.exports.injectConfig = function (isProduction) {
	({ guildSetup } = require("./../../helpers.js").injectConfig(isProduction));
	({ resetScores } = require('../playerDAO.js').injectConfig(isProduction));
	return this;
}

module.exports.execute = (interaction) => {
	// Creates a new category and main text channel, storing the values in the guildDictionary
	let guildProfile = guildSetup(interaction.guild);
	resetScores(guildProfile.userIds, interaction.guild.id);
	interaction.reply("The score wipe and reset of the PotL category and central text channel has begun.");
}
