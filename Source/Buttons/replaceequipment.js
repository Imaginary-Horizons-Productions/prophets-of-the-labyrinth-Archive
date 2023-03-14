const Button = require('../../Classes/Button.js');
const { getAdventure, setAdventure } = require('../adventureDAO.js');
const { getEquipmentProperty } = require('../equipment/_equipmentDictionary.js');
const { generateRoutingRow, generateLootRow, generateMerchantRows, updateRoomHeader } = require("../roomDAO.js");

const id = "replaceequipment";
module.exports = new Button(id, (interaction, [name, index, atMerchant]) => {
	// Replace the delver's equipment at the given index with the given equipment
	let adventure = getAdventure(interaction.channel.id);
	const { count, cost } = adventure.room.resources[name];
	if (count > 0) {
		let delver = adventure.delvers.find(delver => delver.id === interaction.user.id);
		let discardedName = delver.equipment[index].name;
		delver.equipment.splice(index, 1, { name, uses: getEquipmentProperty(name, "maxUses") });
		interaction.channel.messages.fetch(adventure.messageIds.room).then(roomMessage => {
			adventure.room.resources[name].count--;
			let uiRows = [];
			if (Boolean(atMerchant)) {
				adventure.gold -= cost;
				uiRows = generateMerchantRows(adventure);
			} else {
				uiRows.push(generateLootRow(adventure));
			}
			uiRows.push(generateRoutingRow(adventure));
			updateRoomHeader(adventure, roomMessage);
			return roomMessage.edit({ components: uiRows });
		}).then(() => {
			interaction.update({ components: [] });
			interaction.channel.send(`${interaction.user} buys a ${name} for ${cost}g (${discardedName} discarded).`);
			setAdventure(adventure);
		})
	} else {
		interaction.update({ content: `There aren't any more ${name} to take.`, components: [] });
	}
});
