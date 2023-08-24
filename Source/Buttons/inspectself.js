const Button = require('../../Classes/Button.js');
const { getAdventure } = require('../adventureDAO.js');
const { delverStatsPayload } = require('../equipmentDAO.js');

const customId = "inspectself";
module.exports = new Button(customId, (interaction, args) => {
	// Provide the player their combat stats
	const adventure = getAdventure(interaction.channel.id);
	const delver = adventure.delvers.find(delver => delver.id === interaction.user.id);
	interaction.reply(delverStatsPayload(delver, adventure.getEquipmentCapacity()))
		.catch(console.error);
});
