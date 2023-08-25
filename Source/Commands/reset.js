const Command = require('../../Classes/Command.js');
const { getGuild } = require('../guildDAO.js');
const { resetScores } = require('../playerDAO.js');

const customId = "reset";
const options = [];
module.exports = new Command(customId, "(Manager) Reset player scores for this server", true, false, options);

module.exports.execute = (interaction) => {
	if (interaction.inGuild()) {
		const guildProfile = getGuild(interaction.guildId);
		resetScores(guildProfile.userIds, interaction.guildId);
		interaction.reply("The score wipe has begun.");
	} else {
		interaction.reply({ content: "There are no scores to reset in DMs.", ephemeral: true });
	}
}
