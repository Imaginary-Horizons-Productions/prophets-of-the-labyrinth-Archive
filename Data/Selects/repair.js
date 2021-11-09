const Select = require('../../Classes/Select.js');
const { getAdventure, generateRandomNumber, saveAdventures } = require('../adventureDAO.js');

module.exports = new Select("repair");

module.exports.execute = (interaction, args) => {
	// Grant half the selected weapon's max uses
	let adventure = getAdventure(interaction.channel.id);
	if (adventure.room.loot.forgeSupplies > 0) {
		let user = adventure.delvers.find(delver => delver.id === interaction.user.id);
		let weaponIndex = interaction.values[0];
		let weapon = user.weapons[weaponIndex];
		let repairValue = Math.min(Math.ceil(weapon.maxUses / 2), weapon.maxUses - weapon.uses);
		weapon.uses += repairValue;
		adventure.room.loot.forgeSupplies--;
		interaction.reply({ content: `Your ${weapon.name} regained ${repairValue} uses.`, ephemeral: true });
		saveAdventures();
	} else {
		interaction.reply({ content: "The forge's supplies have been exhausted.", ephemeral: true });
	}
}
