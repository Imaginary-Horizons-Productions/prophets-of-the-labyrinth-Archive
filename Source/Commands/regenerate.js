const { Adventure } = require('../../Classes/Adventure.js');
const Command = require('../../Classes/Command.js');
const { getAdventure } = require('../adventureDAO.js');
const { renderRoom } = require('../roomDAO.js');

const customId = "regenerate";
const options = [];
module.exports = new Command(customId, "Regenerate the current room message for an adventure", false, false, options);

/** Call renderRoom to regenerate room embed and components */
module.exports.execute = (interaction) => {
	const adventure = getAdventure(interaction.channelId);
	if (!adventure || Adventure.endStates.includes(adventure.state)) {
		interaction.reply({ content: "This channel doesn't appear to be an active adventure's thread.", ephemeral: true });
		return;
	}

	[adventure.messageIds.room, adventure.messageIds.battleRound].forEach(messageId => {
		interaction.channel.messages.fetch(messageId).then(message => {
			message.edit({ components: [] });
		});
	})

	interaction.reply(renderRoom(adventure, interaction.channel));
}
