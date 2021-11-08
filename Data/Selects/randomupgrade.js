const Select = require('../../Classes/Select.js');
const { getAdventure, nextRandomNumber, saveAdventures } = require('../adventureDAO.js');
const { getWeapon } = require('../Weapons/_weaponDictionary.js');

module.exports = new Select("randomupgrade");

module.exports.execute = (interaction, args) => {
	// Randomly select an upgrade for a given weapon
	let adventure = getAdventure(interaction.channel.id);
	let user = adventure.delvers.find(delver => delver.id === interaction.user.id);
	let weaponIndex = interaction.values[0];
	let weapon = user.weapons[weaponIndex];
	let upgradePool = weapon.upgrades;
	let upgradeName = weapon.upgrades[nextRandomNumber(adventure, upgradePool.length, "general")];
	let upgrade = getWeapon(upgradeName);
	let usesDifference = upgrade.maxUses - weapon.maxUses;
	if (usesDifference > 0) {
		weapon.uses += usesDifference;
	}
	if (weapon.uses > upgrade.maxUses) {
		upgrade.uses = upgrade.maxUses;
	} else {
		upgrade.uses = weapon.uses;
	}
	user.weapons.splice(weaponIndex, 1, upgrade);
	adventure.room.loot.randomUpgrade--;
	interaction.reply({ content: `Your *${weapon.name}* has been upgraded to **${upgradeName}**!`, ephemeral: true });
	saveAdventures();
}
