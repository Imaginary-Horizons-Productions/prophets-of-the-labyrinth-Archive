const Select = require('../../Classes/Select.js');
const { SAFE_DELIMITER } = require('../../constants.js');
const { getAdventure, setAdventure } = require('../adventureDAO.js');
const { decrementForgeSupplies } = require('../roomDAO.js');

const id = "repair";
module.exports = new Select(id, (interaction, [roomMessageId]) => {
	// Grant half the selected equipment's max uses
	let adventure = getAdventure(interaction.channel.id);
	if (adventure.room.resources.forgeSupplies.count > 0) {
		let user = adventure.delvers.find(delver => delver.id === interaction.user.id);
		let [equipmentName, index, value] = interaction.values[0].split(SAFE_DELIMITER);
		user.equipment[index].uses += Number(value);
		decrementForgeSupplies(interaction, roomMessageId, adventure.room).then(() => {
			interaction.update({ components: [] });
			interaction.channel.send({ content: `${interaction.user} repaired ${value} uses on their ${equipmentName}.` });
			setAdventure(adventure);
		});
	} else {
		interaction.reply({ content: "The forge's supplies have been exhausted.", ephemeral: true });
	}
});
