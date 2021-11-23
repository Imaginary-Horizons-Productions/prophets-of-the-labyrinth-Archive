const Select = require('../../Classes/Select.js');
const { getAdventure, saveAdventures } = require('../adventureDAO.js');
const { getWeaponProperty } = require('../Weapons/_weaponDictionary.js');

module.exports = new Select("repair");

module.exports.execute = (interaction, args) => {
	// Grant half the selected weapon's max uses
	let adventure = getAdventure(interaction.channel.id);
	if (adventure.room.loot.forgeSupplies > 0) {
		let user = adventure.delvers.find(delver => delver.id === interaction.user.id);
		let weaponName = interaction.values[0];
		let maxUses = getWeaponProperty(weaponName, "maxUses");
		let repairValue = Math.min(Math.ceil(maxUses / 2), maxUses - user.weapons[weaponName]);
		user.weapons[weaponName] += repairValue;
		adventure.room.loot.forgeSupplies--;
		interaction.reply({ content: `Your ${weaponName} regained ${repairValue} uses.`, ephemeral: true });
		saveAdventures();
	} else {
		interaction.reply({ content: "The forge's supplies have been exhausted.", ephemeral: true });
	}
}
