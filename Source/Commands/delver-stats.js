const Command = require('../../Classes/Command.js');
const { getAdventure } = require('../adventureDAO.js');
const { delverStatsPayload } = require('../equipmentDAO.js');

const options = [];
module.exports = new Command("delver-stats", "Get your adventure-specific stats for the thread's adventure", false, false, options);

module.exports.execute = (interaction) => {
	// Show the delver stats of the user
	const adventure = getAdventure(interaction.channelId);
	if (adventure) {
		let delver = adventure.delvers.find(delver => delver.id === interaction.user.id);
		if (delver) {
			interaction.reply(delverStatsPayload(delver, adventure.getEquipmentCapacity()))
				.catch(console.error);
		} else {
			interaction.reply({ content: "You are not a part of this adventure.", ephemeral: true });
		}
	} else {
		interaction.reply({ content: "This channel doesn't appear to be an adventure's thread.", ephemeral: true });
	}
}
