const Command = require('../../Classes/Command.js');
const { getGuild } = require('../guildDAO.js');

const options = [];
module.exports = new Command("reset", "(Manager) Reset player scores for this server", true, false, options);

// imports from files that depend on /Config
let resetScores;
module.exports.injectConfig = function (isProduction) {
	({ resetScores } = require('../playerDAO.js').injectConfig(isProduction));
	return this;
}

module.exports.execute = (interaction) => {
	if (interaction.inGuild()) {
		const guildProfile = getGuild(interaction.guildId);
		resetScores(guildProfile.userIds, interaction.guildId);
		interaction.reply("The score wipe has begun.");
	} else {
		interaction.reply({ content: "There are no scores to reset in DMs.", ephemeral: true });
	}
}
