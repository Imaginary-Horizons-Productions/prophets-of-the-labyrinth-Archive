const { ActionRowBuilder, StringSelectMenuBuilder, Interaction } = require('discord.js');
const Button = require('../../Classes/Button.js');
const { SAFE_DELIMITER } = require('../../constants.js');
const { getEquipmentProperty } = require('../equipment/_equipmentDictionary.js');
const { getAdventure } = require("./../adventureDAO.js");

const id = "upgrade";
module.exports = new Button(id,
	/** Present the user with an opportunity to upgrade a piece of equipment
	 * @param {Interaction} interaction
	 * @param {string[]} args
	 */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channelId);
		const delver = adventure?.delvers.find(delver => delver.id == interaction.user.id);
		if (!delver) {
			interaction.reply({ content: "This adventure isn't active or you aren't participating in it.", ephemeral: true });
			return;
		}

		if (adventure.room.resources.roomAction.count < 1) {
			interaction.reply({ content: "The forge's supplies have been exhausted.", ephemeral: true });
			return;
		}

		const options = [];
		delver.equipment.forEach((equip, index) => {
			const upgrades = getEquipmentProperty(equip.name, "upgrades");
			const sidegrades = getEquipmentProperty(equip.name, "sidegrades");
			const tinkerPool = upgrades.concat(sidegrades);
			if (tinkerPool.length > 0) {
				options.push({
					label: equip.name,
					description: `Results: ${tinkerPool.join(", ")}`,
					value: `${equip.name}${SAFE_DELIMITER}${index}`
				})
			}
		})
		if (options.length > 0) {
			let upgradeSelect = new ActionRowBuilder().addComponents(
				new StringSelectMenuBuilder().setCustomId("randomupgrade")
					.setPlaceholder("Pick a piece of equipment to randomly tinker with...")
					.setOptions(options)
			)
			interaction.reply({ content: `You can pick a piece of equipment and consume 1 set of forge supplies to tinker with that piece of equipment. It'll upgrade if it hasn't already or change form if it has.`, components: [upgradeSelect], ephemeral: true });
		} else {
			interaction.reply({ content: "You don't have any equipment that can be tinkered with.", ephemeral: true });
		}
	});
