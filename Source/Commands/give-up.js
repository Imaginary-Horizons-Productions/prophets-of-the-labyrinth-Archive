const { Adventure } = require('../../Classes/Adventure.js');
const Command = require('../../Classes/Command.js');
const { completeAdventure, getAdventure } = require('../adventureDAO.js');

const id = "give-up";
const options = [];
module.exports = new Command(id, "Lets the adventure leader end the adventure", false, false, options);

module.exports.execute = (interaction) => {
	// Give up on the current adventure
	const adventure = getAdventure(interaction.channelId);
	if (adventure && !Adventure.endStates.includes(adventure.state)) {
		if (interaction.user.id === adventure.leaderId) {
			interaction.reply(completeAdventure(adventure, interaction.channel, "giveup"));
		} else {
			interaction.reply({ content: "Please ask the leader to end the adventure.", ephemeral: true });
		}
	} else {
		interaction.reply({ content: "This channel doesn't appear to be an active adventure's thread.", ephemeral: true });
	}
}
