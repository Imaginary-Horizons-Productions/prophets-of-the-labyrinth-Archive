const Command = require('../../Classes/Command.js');

const options = [];
module.exports = new Command("reset", "(Manager) Reset player scores for this server", true, false, options);

// imports from files that depend on /Config
let resetScores;
module.exports.injectConfig = function (isProduction) {
	({ resetScores } = require('../playerDAO.js').injectConfig(isProduction));
	return this;
}

module.exports.execute = (interaction) => {
	resetScores(guildProfile.userIds, interaction.guild.id);
	interaction.reply("The score wipe has begun.");
}
