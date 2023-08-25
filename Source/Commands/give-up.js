const { Adventure } = require('../../Classes/Adventure.js');
const Command = require('../../Classes/Command.js');
const { completeAdventure, getAdventure } = require('../adventureDAO.js');

const customId = "give-up";
const options = [];
module.exports = new Command(customId, "Ends the adventure", false, false, options);

/** Give up on the current adventure */
module.exports.execute = (interaction) => {
	const adventure = getAdventure(interaction.channelId);
	if (adventure && !Adventure.endStates.includes(adventure.state)) {
		interaction.reply(completeAdventure(adventure, interaction.channel, "giveup"));
	} else {
		interaction.reply({ content: "This channel doesn't appear to be an active adventure's thread.", ephemeral: true });
	}
}
