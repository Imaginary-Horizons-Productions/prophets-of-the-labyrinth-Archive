const Button = require('../../Classes/Button.js');
const { getAdventure, setAdventure } = require('../adventureDAO.js');
const { editButton } = require('../roomDAO.js');
const { getWeaponProperty } = require('../Weapons/_weaponDictionary.js');

module.exports = new Button("replaceweapon");

module.exports.execute = (interaction, [weaponName, index, roomMessageId]) => {
	// Replace the delver's weapon at the given index with the given weapon
	let adventure = getAdventure(interaction.channel.id);
	if (adventure.room.loot[`weapon-${weaponName}`] > 0) {
		let delver = adventure.delvers.find(delver => delver.id === interaction.user.id);
		let discardedName = delver.weapons[index].name;
		delver.weapons.splice(index, 1, { name: weaponName, uses: getWeaponProperty(weaponName, "maxUses") });
		interaction.channel.messages.fetch(roomMessageId).then(roomMessage => {
			let remaining = --adventure.room.loot[`weapon-${weaponName}`];
			let updatedUI;
			if (remaining !== 0) {
				updatedUI = editButton(roomMessage, `takeweapon-${weaponName}`, false, "", `${weaponName} x${remaining} remaining`);
			} else {
				updatedUI = editButton(roomMessage, `takeweapon-${weaponName}`, true, "✔️", `${weaponName} GET`);
			}
			return roomMessage.edit({ components: updatedUI });
		}).then(() => {
			interaction.reply(`${interaction.user} discards ${discardedName} to take ${weaponName}.`);
			setAdventure(adventure);
		})
	} else {
		interaction.reply({ content: `There aren't any more ${weaponName} to take.`, ephemeral: true });
	}
}
