const { MessageActionRow, MessageButton } = require('discord.js');
const Button = require('../../Classes/Button.js');
const { setAdventure, getAdventure } = require('../adventureDAO.js');
const { editButton } = require('../roomDAO.js');
const { getWeaponProperty } = require('../Weapons/_weaponDictionary.js');

module.exports = new Button("takeweapon");

module.exports.execute = (interaction, [weaponName]) => {
	// Add the given weapon the the delver's weapon list
	let adventure = getAdventure(interaction.channel.id);
	let delver = adventure.delvers.find(delver => delver.id === interaction.user.id);
	if (delver) {
		if (delver.weapons.length < 4) {
			delver.weapons.push({ name: weaponName, uses: getWeaponProperty(weaponName, "maxUses") });
			let remaining = --adventure.room.loot[`weapon-${weaponName}`];
			let updatedUI;
			if (remaining !== 0) {
				updatedUI = editButton(interaction.message, `takeweapon-${weaponName}`, false, "", `${weaponName} x${remaining} remaining`);
			} else {
				updatedUI = editButton(interaction.message, `takeweapon-${weaponName}`, true, "✔️", `${weaponName} GET`);
			}
			interaction.message.edit({ components: updatedUI });
			interaction.reply({ content: `${interaction.member.displayName} takes a ${weaponName}.` });
			setAdventure(adventure);
		} else {
			let replaceUI = [new MessageActionRow().addComponents(
				...delver.weapons.map((weapon, index) => {
					return new MessageButton().setCustomId(`replaceweapon-${weaponName}-${index}-${interaction.message.id}`)
						.setLabel(`Discard ${weapon.name}`)
						.setStyle("PRIMARY")
				})
			)];
			interaction.reply({ content: "You can only carry 4 weapons at a time. Pick one to replace:", components: replaceUI, ephemeral: true });
		}
	} else {
		interaction.reply({ content: "Please take weapons in adventures you've joined.", ephemeral: true });
	}
}
