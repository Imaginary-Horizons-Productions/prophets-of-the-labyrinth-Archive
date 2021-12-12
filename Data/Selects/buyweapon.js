const Select = require('../../Classes/Select.js');
const { getAdventure } = require('../adventureDAO.js');

module.exports = new Select("buyweapon");

module.exports.execute = (interaction, args) => {
	// Randomly select an upgrade for a given weapon
	let adventure = getAdventure(interaction.channel.id);
	let user = adventure.delvers.find(delver => delver.id === interaction.user.id);
	if (user) {
		let [weaponName, menuIndex] = interaction.values[0].split("-");
		if (adventure.room.loot[weaponName] > 0) {
			//TODONOW max 4 weapons
			//TODONOW generate confirmation ui (check for need to replace weapons) and theivery
		} else {
			interaction.reply({ content: `There are no more ${weaponName} for sale.`, ephemeral: true });
		}
	} else {
		interaction.reply({ content: "Please purchase weapons in adventures you've joined.", ephemeral: true });
	}
}
