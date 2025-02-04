const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Select = require('../../Classes/Select.js');
const { getAdventure, setAdventure } = require('../adventureDAO.js');
const { getEquipmentProperty } = require('../equipment/_equipmentDictionary.js');
const { SAFE_DELIMITER, ZERO_WIDTH_WHITESPACE } = require('../../constants.js');
const { consumeRoomActions, renderRoom } = require("../roomDAO.js");

const id = "treasure";
module.exports = new Select(id,
	/** Move the selected loot into party/delver's inventory, then decrement a roomAction */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channel.id);
		const delver = adventure?.delvers.find(delver => delver.id === interaction.user.id);
		if (!delver) {
			interaction.reply({ content: "You aren't in this adventure.", ephemeral: true });
			return;
		}

		if (adventure.room.resources.roomAction.count > 0) {
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
									return new ButtonBuilder().setCustomId(`replaceequipment${SAFE_DELIMITER}${name}${SAFE_DELIMITER}${index}${SAFE_DELIMITER}true`)
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
				const { embeds } = consumeRoomActions(adventure, interaction.message.embeds, 1);
				const updatedMessage = { ...renderRoom(adventure, interaction.channel), embeds };
				interaction.reply(result).then(() => {
					interaction.message.edit(updatedMessage);
					setAdventure(adventure);
				});
			} else {
				interaction.update({ content: ZERO_WIDTH_WHITESPACE });
			}
		} else {
			interaction.reply({ content: "There aren't any more treasure picks to use.", ephemeral: true });
		}
	});
