const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Select = require('../../Classes/Select.js');
const { getAdventure, setAdventure } = require('../adventureDAO.js');
const { getEquipmentProperty } = require('../equipment/_equipmentDictionary.js');
const { SAFE_DELIMITER, ZERO_WIDTH_WHITESPACE } = require('../../constants.js');
const { renderRoom } = require("../roomDAO.js");

const id = "loot";
module.exports = new Select(id, (interaction, args) => {
	// Move the selected loot into party/delver's inventory
	const adventure = getAdventure(interaction.channel.id);
	const delver = adventure.delvers.find(delver => delver.id === interaction.user.id);
	const [name, index] = interaction.values[0].split(SAFE_DELIMITER);
	let result;
	const { resourceType: type, count } = adventure.room.resources[name];
	if (count && count > 0) { // Prevents double message if multiple players take near same time
		switch (type) {
			case "gold":
				adventure.gainGold(count);
				adventure.room.resources.gold = 0;
				result = {
					content: `The party acquires ${count} gold.`
				}
				break;
			case "artifact":
				adventure.gainArtifact(name, count);
				adventure.room.resources[name] = 0;
				result = {
					content: `The party acquires ${name} x ${count}.`
				}
				break;
			case "equipment":
				if (delver.equipment.length < adventure.getEquipmentCapacity()) {
					delver.equipment.push({ name, uses: getEquipmentProperty(name, "maxUses") });
					adventure.room.resources[name].count = Math.max(count - 1, 0);
					result = {
						content: `${interaction.member.displayName} takes a ${name}. There are ${count - 1} remaining.`
					}
				} else {
					result = {
						content: `You can only carry ${adventure.getEquipmentCapacity()} pieces of equipment at a time. Pick one to replace with the ${name}:`,
						components: [new ActionRowBuilder().addComponents(delver.equipment.map((equip, index) => {
							return new ButtonBuilder().setCustomId(`replaceequipment${SAFE_DELIMITER}${name}${SAFE_DELIMITER}${index}${SAFE_DELIMITER}false`)
								.setLabel(`Discard ${equip.name}`)
								.setStyle(ButtonStyle.Secondary)
						}))],
						ephemeral: true
					};
				}
				break;
			case "consumable":
				if (name in adventure.consumables) {
					adventure.consumables[name] += count;
				} else {
					adventure.consumables[name] = count;
				}
				adventure.room.resources[name] = 0;
				result = {
					content: `The party acquires ${name} x ${count}.`
				}
				break;
		}
	}
	if (result) {
		interaction.reply(result).then(() => {
			interaction.message.edit(renderRoom(adventure, interaction.channel));
			setAdventure(adventure);
		});
	} else {
		interaction.update({ content: ZERO_WIDTH_WHITESPACE });
	}
});
