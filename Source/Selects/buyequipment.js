const { MessageActionRow, MessageButton } = require('discord.js');
const Select = require('../../Classes/Select.js');
const { SAFE_DELIMITER } = require('../../helpers.js');
const { getAdventure, setAdventure, generateMerchantRows, generateRoutingRow } = require('../adventureDAO.js');
const { getEquipmentProperty } = require('../equipment/_equipmentDictionary.js');

module.exports = new Select("buyweapon");

module.exports.execute = (interaction, [tier]) => {
	// Create the weapon details embed so player can decide whether to buy the weapon
	let adventure = getAdventure(interaction.channel.id);
	let delver = adventure.delvers.find(delver => delver.id === interaction.user.id);
	if (delver) {
		const [name, menuIndex] = interaction.values[0].split(SAFE_DELIMITER);
		const { count, cost } = adventure.room.resources[name];
		if (count > 0) {
			if (adventure.gold >= cost) {
				if (delver.weapons.length < adventure.getWeaponCapacity()) {
					adventure.gold -= cost;
					adventure.room.resources[name].count--;
					delver.weapons.push({ name, uses: getEquipmentProperty(name, "maxUses") });
					let updatedUI = [...generateMerchantRows(adventure), generateRoutingRow(adventure)];
					interaction.message.edit({ components: updatedUI });
					interaction.reply({ content: `${interaction.member.displayName} takes a ${name}.` });
					setAdventure(adventure);
				} else {
					let replaceUI = [new MessageActionRow().addComponents(
						...delver.weapons.map((weapon, index) => {
							return new MessageButton().setCustomId(`replaceweapon${SAFE_DELIMITER}${name}${SAFE_DELIMITER}${index}${SAFE_DELIMITER}true`)
								.setLabel(`Discard ${weapon.name}`)
								.setStyle("SECONDARY")
						})
					)];
					interaction.reply({ content: `You can only carry ${adventure.getWeaponCapacity()} weapons at a time. Pick one to replace:`, components: replaceUI, ephemeral: true });
				}
			} else {
				interaction.reply({ content: "You don't have enough money to buy that.", ephemeral: true });
			}
		} else {
			interaction.reply({ content: `There are no more ${name} for sale.`, ephemeral: true });
		}
	} else {
		interaction.reply({ content: "Please purchase weapons in adventures you've joined.", ephemeral: true });
	}
}
