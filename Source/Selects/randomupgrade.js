const Select = require('../../Classes/Select.js');
const { generateRandomNumber } = require('../../helpers.js');
const { getAdventure, setAdventure } = require('../adventureDAO.js');
const { decrementForgeSupplies } = require('../roomDAO.js');
const { getWeaponProperty } = require('../Weapons/_weaponDictionary.js');

module.exports = new Select("randomupgrade");

module.exports.execute = (interaction, [roomMessageId]) => {
	// Randomly select an upgrade for a given weapon
	let adventure = getAdventure(interaction.channel.id);
	if (adventure.room.resources.forgeSupplies.count > 0) {
		let user = adventure.delvers.find(delver => delver.id === interaction.user.id);
		let [weaponName, weaponIndex] = interaction.values[0].split("-");
		let upgradePool = getWeaponProperty(weaponName, "upgrades");
		let upgradeName = upgradePool[generateRandomNumber(adventure, upgradePool.length, "general")];
		let upgradeUses = getWeaponProperty(upgradeName, "maxUses");
		let usesDifference = upgradeUses - getWeaponProperty(weaponName, "maxUses");
		if (usesDifference > 0) {
			user.weapons[weaponIndex].uses += usesDifference;
		}
		user.weapons.splice(weaponIndex, 1, { name: upgradeName, uses: Math.min(upgradeUses, user.weapons[weaponIndex].uses) });
		decrementForgeSupplies(interaction, roomMessageId, adventure).then(() => {
			interaction.reply(`${interaction.user}'s *${weaponName}* has been upgraded to **${upgradeName}**!`);
			setAdventure(adventure);
		});
	} else {
		interaction.reply({ content: "The forge's supplies have been exhausted.", ephemeral: true });
	}
}
