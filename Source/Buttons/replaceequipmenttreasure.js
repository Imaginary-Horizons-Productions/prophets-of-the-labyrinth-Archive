const Button = require('../../Classes/Button.js');
const { getAdventure, setAdventure } = require('../adventureDAO.js');
const { getEquipmentProperty } = require('../equipment/_equipmentDictionary.js');
const { generateRoutingRow, generateLootRow, generateMerchantRows } = require("../roomDAO.js");

const id = "replaceequipmenttreasure";
module.exports = new Button(id,
	/** Replace the delver's equipment at the given index with the given equipment
	 */
	(interaction, [name, index, atMerchant]) => {
		const adventure = getAdventure(interaction.channel.id);
		if (adventure?.room.resources.roomAction.count > 0) {
			const { count, cost } = adventure.room.resources[name];
			if (count > 0) {
				let delver = adventure.delvers.find(delver => delver.id === interaction.user.id);
				let discardedName = delver.equipment[index].name;
				delver.equipment.splice(index, 1, { name, uses: getEquipmentProperty(name, "maxUses") });
				interaction.channel.messages.fetch(adventure.messageIds.room).then(roomMessage => {
					adventure.room.resources[name].count--;
					adventure.room.resources.roomAction.count--;
					let uiRows = [];
					if (Boolean(atMerchant)) {
						adventure.gold -= cost;
						uiRows = generateMerchantRows(adventure);
					} else {
						uiRows.push(generateLootRow(adventure));
					}
					uiRows.push(generateRoutingRow(adventure));
					return roomMessage.edit({ components: uiRows });
				}).then(() => {
					interaction.update({ components: [] });
					interaction.channel.send(`${interaction.user} discards ${discardedName} to take ${name}.`);
					setAdventure(adventure);
				})
			} else {
				interaction.update({ content: `There aren't any more ${name} to take.`, components: [] });
			}
		} else {
			interaction.reply({ content: "There aren't any more treasure picks to use.", ephemeral: true });
		}
	});
