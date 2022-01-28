const Button = require('../../Classes/Button.js');
const { getAdventure, setAdventure, generateRoutingRow, generateLootRow, generateMerchantRows } = require('../adventureDAO.js');
const { getWeaponProperty } = require('../Weapons/_weaponDictionary.js');

module.exports = new Button("replaceweapon");

module.exports.execute = (interaction, [name, weaponIndex, atMerchant]) => {
	// Replace the delver's weapon at the given index with the given weapon
	let adventure = getAdventure(interaction.channel.id);
	const { count, cost } = adventure.room.resources[name];
	if (count > 0) {
		let delver = adventure.delvers.find(delver => delver.id === interaction.user.id);
		let discardedName = delver.weapons[weaponIndex].name;
		delver.weapons.splice(weaponIndex, 1, { name, uses: getWeaponProperty(name, "maxUses") });
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
			return roomMessage.edit({ components: uiRows });
		}).then(() => {
			interaction.update({ components: [] });
			interaction.channel.send(`${interaction.user} discards ${discardedName} to take ${name}.`);
			setAdventure(adventure);
		})
	} else {
		interaction.update({ content: `There aren't any more ${name} to take.`, components: [] });
	}
}
