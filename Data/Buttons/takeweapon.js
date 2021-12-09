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
			if (remaining !== 0) {
				editButton(interaction, `takeweapon-${weaponName}`, false, "", `${weaponName} x${remaining} remaining`);
			} else {
				editButton(interaction, `takeweapon-${weaponName}`, true, "✔️", `${weaponName} GET`);
			}
			interaction.followUp({ content: `${interaction.member.displayName} takes a ${weaponName}.` });
			setAdventure(adventure);
		} else {
			interaction.reply("You can only carry 4 weapons at a time. (Weapon replacement coming soon).");
		}
	} else {
		interaction.reply({ content: "Please take weapons in adventures you've joined.", ephemeral: true });
	}
}
