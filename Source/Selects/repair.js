const Select = require('../../Classes/Select.js');
const { SAFE_DELIMITER } = require('../../helpers.js');
const { getAdventure, setAdventure } = require('../adventureDAO.js');
const { decrementForgeSupplies } = require('../roomDAO.js');

module.exports = new Select("repair");

module.exports.execute = (interaction, [roomMessageId]) => {
	// Grant half the selected weapon's max uses
	let adventure = getAdventure(interaction.channel.id);
	if (adventure.room.resources.forgeSupplies.count > 0) {
		let user = adventure.delvers.find(delver => delver.id === interaction.user.id);
		let [weaponName, weaponIndex, value] = interaction.values[0].split(SAFE_DELIMITER);
		user.weapons[weaponIndex].uses += Number(value);
		decrementForgeSupplies(interaction, roomMessageId, adventure.room).then(() => {
			interaction.update({ components: [] });
			interaction.channel.send({ content: `${interaction.user} repaired ${value} uses on their ${weaponName}.` });
			setAdventure(adventure);
		});
	} else {
		interaction.reply({ content: "The forge's supplies have been exhausted.", ephemeral: true });
	}
}
