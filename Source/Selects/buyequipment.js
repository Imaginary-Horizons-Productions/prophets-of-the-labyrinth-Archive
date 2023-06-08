const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Select = require('../../Classes/Select.js');
const { SAFE_DELIMITER } = require('../../constants.js');
const { getAdventure, setAdventure } = require('../adventureDAO.js');
const { getEquipmentProperty } = require('../equipment/_equipmentDictionary.js');
const { renderRoom } = require("../roomDAO.js");

const id = "buyequipment";
module.exports = new Select(id, (interaction, [tier]) => {
	// Create the equipment details embed so player can decide whether to make the purchase
	const adventure = getAdventure(interaction.channel.id);
	const delver = adventure.delvers.find(delver => delver.id === interaction.user.id);
	const [name, menuIndex] = interaction.values[0].split(SAFE_DELIMITER);
	const { count, cost } = adventure.room.resources[name];
	if (count > 0) {
		if (adventure.gold >= cost) {
			if (delver.equipment.length < adventure.getEquipmentCapacity()) {
				adventure.gold -= cost;
				adventure.room.resources[name].count--;
				delver.equipment.push({ name, uses: getEquipmentProperty(name, "maxUses") });
				interaction.message.edit(renderRoom(adventure, interaction.channel));
				interaction.reply({ content: `${interaction.member.displayName} buys a ${name} for ${cost}g.` });
				setAdventure(adventure);
			} else {
				let replaceUI = [new ActionRowBuilder().addComponents(
					delver.equipment.map((equip, index) => {
						return new ButtonBuilder().setCustomId(`replaceequipment${SAFE_DELIMITER}${name}${SAFE_DELIMITER}${index}${SAFE_DELIMITER}false`)
							.setLabel(`Discard ${equip.name}`)
							.setStyle(ButtonStyle.Secondary)
					})
				)];
				interaction.reply({ content: `You can only carry ${adventure.getEquipmentCapacity()} pieces of equipment at a time. Pick one to replace:`, components: replaceUI, ephemeral: true });
			}
		} else {
			interaction.reply({ content: "You don't have enough money to buy that.", ephemeral: true });
		}
	} else {
		interaction.reply({ content: `There are no more ${name} for sale.`, ephemeral: true });
	}
});
