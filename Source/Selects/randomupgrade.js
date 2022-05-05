const Select = require('../../Classes/Select.js');
const { SAFE_DELIMITER } = require('../../helpers.js');
const { generateRandomNumber } = require('../../helpers.js');
const { getAdventure, setAdventure } = require('../adventureDAO.js');
const { decrementForgeSupplies } = require('../roomDAO.js');
const { getEquipmentProperty } = require('../equipment/_equipmentDictionary.js');

module.exports = new Select("randomupgrade");

module.exports.execute = (interaction, [roomMessageId]) => {
	// Randomly select an upgrade for a given piece of equipment
	let adventure = getAdventure(interaction.channel.id);
	if (adventure.room.resources.forgeSupplies.count > 0) {
		let user = adventure.delvers.find(delver => delver.id === interaction.user.id);
		let [equipmentName, index] = interaction.values[0].split(SAFE_DELIMITER);
		let upgradePool = getEquipmentProperty(equipmentName, "upgrades");
		let upgradeName = upgradePool[generateRandomNumber(adventure, upgradePool.length, "general")];
		let upgradeUses = getEquipmentProperty(upgradeName, "maxUses");
		let usesDifference = upgradeUses - getEquipmentProperty(equipmentName, "maxUses");
		if (usesDifference > 0) {
			user.equipment[index].uses += usesDifference;
		}
		user.equipment.splice(index, 1, { name: upgradeName, uses: Math.min(upgradeUses, user.equipment[index].uses) });
		decrementForgeSupplies(interaction, roomMessageId, adventure.room).then(() => {
			interaction.update({ components: [] });
			interaction.channel.send(`${interaction.user}'s *${equipmentName}* has been upgraded to **${upgradeName}**!`);
			setAdventure(adventure);
		});
	} else {
		interaction.reply({ content: "The forge's supplies have been exhausted.", ephemeral: true });
	}
}
