const Button = require('../../Classes/Button.js');
const { getAdventure } = require('../adventureDAO.js');
const { inspectSelfPayload } = require('../equipmentDAO.js');

const customId = "inspectself";
module.exports = new Button(customId,
	/** Provide the player their combat stats */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channel.id);
		const delver = adventure?.delvers.find(delver => delver.id == interaction.user.id);
		if (!delver) {
			interaction.reply({ content: "This adventure isn't active or you aren't participating in it.", ephemeral: true });
			return;
		}
		interaction.reply(inspectSelfPayload(delver, adventure.getEquipmentCapacity()))
			.catch(console.error);
	}
);
