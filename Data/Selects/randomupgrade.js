const Select = require('../../Classes/Select.js');
const { generateRandomNumber } = require('../../helpers.js');
const { getAdventure, saveAdventures } = require('../adventureDAO.js');
const { getWeaponProperty } = require('../Weapons/_weaponDictionary.js');

module.exports = new Select("randomupgrade");

module.exports.execute = (interaction, args) => {
	// Randomly select an upgrade for a given weapon
	let adventure = getAdventure(interaction.channel.id);
	if (adventure.room.loot.forgeSupplies > 0) {
		let user = adventure.delvers.find(delver => delver.id === interaction.user.id);
		let weaponName = interaction.values[0];
		let upgradePool = getWeaponProperty(weaponName, "upgrades");
		let upgradeName = upgradePool[generateRandomNumber(adventure, upgradePool.length, "General")];
		let upgradeUses = getWeaponProperty(upgradeName, "maxUses");
		let usesDifference = upgradeUses - getWeaponProperty(weaponName, "maxUses");
		if (usesDifference > 0) {
			user.weapons[weaponName] += usesDifference;
		}
		user.weapons[upgradeName] = Math.min(upgradeUses, user.weapons[weaponName]);
		delete user.weapons[weaponName];
		adventure.room.loot.forgeSupplies--;
		interaction.reply(`Your *${weaponName}* has been upgraded to **${upgradeName}**!`);
		saveAdventures();
	} else {
		interaction.reply({ content: "The forge's supplies have been exhausted.", ephemeral: true });
	}
}
