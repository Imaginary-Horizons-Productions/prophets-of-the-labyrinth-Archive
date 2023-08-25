const { ActionRowBuilder, StringSelectMenuBuilder, Interaction } = require('discord.js');
const Button = require('../../Classes/Button.js');
const { SAFE_DELIMITER } = require('../../constants.js');
const { getAdventure } = require("../adventureDAO.js");
const { getEquipmentProperty } = require('../equipment/_equipmentDictionary.js');

const customId = "viewrepairs";
module.exports = new Button(customId,
	/** Allow the user to select a piece of equipment to regain uses on
	 * @param {Interaction} interaction
	 * @param {string[]} args
	 */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channelId);
		const delver = adventure.delvers.find(delver => delver.id === interaction.user.id);
		if (!delver) {
			interaction.reply({ content: "This adventure isn't active or you aren't participating in it.", ephemeral: true });
			return;
		}

		const options = [];
		delver.equipment.forEach((equip, index) => {
			let maxUses = getEquipmentProperty(equip.name, "maxUses");
			if (maxUses > 0 && equip.uses < maxUses) {
				let value = Math.min(Math.ceil(maxUses / 2), maxUses - equip.uses);
				options.push({
					label: equip.name,
					description: `Regain ${value} uses`,
					value: `${equip.name}${SAFE_DELIMITER}${index}${SAFE_DELIMITER}${value}`
				})
			}
		})
		if (adventure.room.resources.roomAction.count > 0) {
			if (options.length > 0) {
				let upgradeSelect = new ActionRowBuilder().addComponents(
					new StringSelectMenuBuilder().setCustomId("repair")
						.setPlaceholder("Pick a piece of equipment to repair...")
						.setOptions(options)
				)
				interaction.reply({ content: "You can consume 1 set of forge supplies to repair your equipment. That piece of equipment will regain half its max uses.", components: [upgradeSelect], ephemeral: true });
			} else {
				interaction.reply({ content: "None of your equipment needs repair.", ephemeral: true });
			}
		} else {
			interaction.reply({ content: "The forge's supplies have been exhausted.", ephemeral: true });
		}
	}
);
