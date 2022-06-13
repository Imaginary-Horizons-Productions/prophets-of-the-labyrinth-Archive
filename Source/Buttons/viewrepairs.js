const { MessageActionRow, MessageSelectMenu } = require('discord.js');
const Button = require('../../Classes/Button.js');
const { SAFE_DELIMITER } = require('../../helpers.js');
const { getAdventure } = require("../adventureDAO.js");
const { getEquipmentProperty } = require('../equipment/_equipmentDictionary.js');

const id = "viewrepairs";
module.exports = new Button(id, (interaction, args) => {
	// Allow the user to select a piece of equipment to regain uses on
	let adventure = getAdventure(interaction.channel.id);
	let user = adventure.delvers.find(delver => delver.id === interaction.user.id);
	if (user) {
		let options = [];
		user.equipment.forEach((equip, index) => {
			let maxUses = getEquipmentProperty(equip.name, "maxUses");
			if (equip.uses < maxUses) {
				let value = Math.min(Math.ceil(maxUses / 2), maxUses - equip.uses);
				options.push({
					label: equip.name,
					description: `Regain ${value} uses`,
					value: `${equip.name}${SAFE_DELIMITER}${index}${SAFE_DELIMITER}${value}`
				})
			}
		})
		if (adventure.room.resources.forgeSupplies.count > 0) {
			if (options.length > 0) {
				let upgradeSelect = new MessageActionRow().addComponents(
					new MessageSelectMenu().setCustomId(`repair${SAFE_DELIMITER}${interaction.message.id}`)
						.setPlaceholder("Pick a piece of equipment to repair...")
						.setOptions(options)
				)
				interaction.reply({ content: "When you repair your equipment, it'll regain half its max uses.", components: [upgradeSelect], ephemeral: true });
			} else {
				interaction.reply({ content: "None of your equipment need repair.", ephemeral: true });
			}
		} else {
			interaction.reply({ content: "The forge's supplies have been exhausted.", ephemeral: true });
		}
	} else {
		interaction.reply({ content: "Please repair equipment in adventures you've joined.", ephemeral: true });
	}
});
