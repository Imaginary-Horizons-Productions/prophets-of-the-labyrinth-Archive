const { MessageActionRow, MessageButton } = require('discord.js');
const Select = require('../../Classes/Select.js');
const { getAdventure, setAdventure } = require('../adventureDAO.js');
const { editSelectOption } = require('../roomDAO.js');
const { getWeaponProperty } = require('../Weapons/_weaponDictionary.js');

module.exports = new Select("buyweapon");

module.exports.execute = (interaction, [tier]) => {
	// Create the weapon details embed so player can decide whether to buy the weapon
	let adventure = getAdventure(interaction.channel.id);
	let delver = adventure.delvers.find(delver => delver.id === interaction.user.id);
	if (delver) {
		let [weaponName, cost, menuIndex] = interaction.values[0].split("-");
		if (adventure.room.loot[`weapon-${weaponName}`] > 0) {
			if (adventure.gold >= cost) {
				adventure.gold -= cost;
				adventure.room.loot[weaponName]--;
				let uses = getWeaponProperty(weaponName, "maxUses");
				if (delver.weapons.length < 4) {
					delver.weapons.push({ name: weaponName, uses });
					let updatedUI = editSelectOption(interaction.message, interaction.customId, `${cost}g: ${weaponName}`, null, "SOLD OUT");
					interaction.message.edit({ components: updatedUI });
					interaction.reply({ content: `${interaction.member.displayName} takes a ${weaponName}.` });
					setAdventure(adventure);
				} else {
					let replaceUI = [new MessageActionRow().addComponents(
						...delver.weapons.map((weapon, index) => {
							return new MessageButton().setCustomId(`replaceweapon-${weaponName}-${index}-${cost}-${tier}`)
								.setLabel(`Discard ${weapon.name}`)
								.setStyle("SECONDARY")
						})
					)];
					interaction.reply({ content: "You can only carry 4 weapons at a time. Pick one to replace:", components: replaceUI, ephemeral: true });
				}
			} else {
				interaction.reply({ content: "You don't have enough money to buy that.", ephemeral: true });
			}
		} else {
			interaction.reply({ content: `There are no more ${weaponName} for sale.`, ephemeral: true });
		}
	} else {
		interaction.reply({ content: "Please purchase weapons in adventures you've joined.", ephemeral: true });
	}
}
