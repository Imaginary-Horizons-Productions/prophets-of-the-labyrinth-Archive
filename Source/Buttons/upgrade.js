const { MessageActionRow, MessageSelectMenu } = require('discord.js');
const Button = require('../../Classes/Button.js');
const { SAFE_DELIMITER } = require('../../constants.js');
const { getEquipmentProperty } = require('../equipment/_equipmentDictionary.js');
const { getAdventure } = require("./../adventureDAO.js");

const id = "upgrade";
module.exports = new Button(id, (interaction, args) => {
	// Present the user with an opportunity to upgrade a piece of equipment
	let adventure = getAdventure(interaction.channel.id);
	let user = adventure.delvers.find(delver => delver.id === interaction.user.id);
	if (user) {
		let options = [];
		user.equipment.forEach((equip, index) => {
			let upgrades = getEquipmentProperty(equip.name, "upgrades");
			if (upgrades.length > 0) {
				options.push({
					label: equip.name,
					description: `Results: ${upgrades.join(", ")}`,
					value: `${equip.name}${SAFE_DELIMITER}${index}`
				})
			}
		})
		if (adventure.room.resources.forgeSupplies.count > 0) {
			if (options.length > 0) {
				let upgradeSelect = new MessageActionRow().addComponents(
					new MessageSelectMenu().setCustomId(`randomupgrade${SAFE_DELIMITER}${interaction.message.id}`)
						.setPlaceholder("Pick a piece of equipment to randomly tinker with...")
						.setOptions(options)
				)
				interaction.reply({ content: `You can pick a piece of equipment and consume 1 set of forge supplies to tinker with that piece of equipment. It'll upgrade if it hasn't already or change form if it has.`, components: [upgradeSelect], ephemeral: true });
			} else {
				interaction.reply({ content: "You don't have any equipment that can be tinkered with.", ephemeral: true });
			}
		} else {
			interaction.reply({ content: "The forge's supplies have been exhausted.", ephemeral: true });
		}
	} else {
		interaction.reply({ content: "Please tinker with equipment in adventures you've joined.", ephemeral: true });
	}
});
