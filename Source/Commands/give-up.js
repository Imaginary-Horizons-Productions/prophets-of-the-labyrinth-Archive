const Command = require('../../Classes/Command.js');
const { completeAdventure, getAdventure } = require('../adventureDAO.js');

const id = "give-up";
const options = [];
module.exports = new Command(id, "Lets the adventure leader end the adventure", false, false, options);

module.exports.execute = (interaction) => {
	// Give up on the current adventure
	const adventure = getAdventure(interaction.channelId);
	if (adventure && adventure.state !== "completed") {
		if (interaction.user.id === adventure.leaderId) {
			interaction.reply({ embeds: [completeAdventure(adventure, interaction.channel, { isSuccess: false, description: null })] });
		} else {
			interaction.reply({ content: "Please ask the leader to end the adventure.", ephemeral: true });
		}
	} else {
		interaction.reply({ content: "This channel doesn't appear to be an active adventure's thread.", ephemeral: true });
	}
}
