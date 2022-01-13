const Button = require('../../Classes/Button.js');
const { getAdventure, setAdventure } = require('../adventureDAO.js');
const { editSelectOption } = require('../roomDAO.js');
const { getWeaponProperty, buildWeaponDescription } = require('../Weapons/_weaponDictionary.js');

module.exports = new Button("replaceweapon");

module.exports.execute = (interaction, [weaponName, weaponIndex, cost, tier]) => {
	// Replace the delver's weapon at the given index with the given weapon
	let adventure = getAdventure(interaction.channel.id);
	if (adventure.room.loot[`weapon-${weaponName}`] > 0) {
		let delver = adventure.delvers.find(delver => delver.id === interaction.user.id);
		let discardedName = delver.weapons[weaponIndex].name;
		delver.weapons.splice(weaponIndex, 1, { name: weaponName, uses: getWeaponProperty(weaponName, "maxUses") });
		interaction.channel.messages.fetch(adventure.messageIds.room).then(roomMessage => {
			let optionLabel = `${weaponName} x ${adventure.room.loot[`weapon-${weaponName}`]}`; // generate label to look for before decrementing
			let remaining = --adventure.room.loot[`weapon-${weaponName}`];
			let replacementOption;
			if (remaining !== 0) {
				replacementOption = {
					label: `${weaponName} x ${remaining}`,
					description: buildWeaponDescription(weaponName, false),
					value: `weapon-${weaponName}`
				};
			} else {
				replacementOption = null;
			}
			let source;
			let placeholder;
			if (tier) {
				source = `buyweapon-${tier}`;
				placeholder = "SOLD OUT";
				adventure.gold -= cost;
			} else {
				source = "loot";
				placeholder = "All looted";
			}
			return roomMessage.edit({ components: editSelectOption(roomMessage, source, optionLabel, replacementOption, placeholder) });
		}).then(() => {
			interaction.update({ components: [] });
			interaction.channel.send(`${interaction.user} discards ${discardedName} to take ${weaponName}.`);
			setAdventure(adventure);
		})
	} else {
		interaction.update({ content: `There aren't any more ${weaponName} to take.`, components: [] });
	}
}
