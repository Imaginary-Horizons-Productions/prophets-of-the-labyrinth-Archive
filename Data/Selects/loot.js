const { MessageActionRow, MessageButton } = require('discord.js');
const Select = require('../../Classes/Select.js');
const { getAdventure, updateRoomHeader, setAdventure, generateLootRow, generateRoutingRow } = require('../adventureDAO.js');
const { getWeaponProperty } = require('../Weapons/_weaponDictionary.js');

module.exports = new Select("loot");

module.exports.execute = (interaction, args) => {
	// Move the selected loot into party/delver's inventory
	let adventure = getAdventure(interaction.channel.id);
	let delver = adventure.delvers.find(delver => delver.id === interaction.user.id);
	if (delver) {
		const [name, index] = interaction.values[0].split("-");
		let result;
		let { resourceType: type, count } = adventure.room.resources[name];
		switch (type) {
			case "gold":
				if (count && count > 0) { // Prevents double message if multiple players take near same time
					adventure.gainGold(count);
					adventure.room.resources.gold = 0;
					result = {
						content: `The party acquires ${count} gold.`
					}
				}
				break;
			case "artifact":
				if (count && count > 0) { // Prevents double message if multiple players take near same time
					adventure.gainArtifact(name, count);
					adventure.room.resources[name] = 0;
					result = {
						content: `The party acquires ${name} x ${count}.`
					}
				}
				break;
			case "weapon":
				if (count && count > 0) { // Prevents double message if multiple players take near same time
					if (delver.weapons.length < adventure.getWeaponCapacity()) {
						delver.weapons.push({ name, uses: getWeaponProperty(name, "maxUses") });
						let updatedCount = --adventure.room.resources[name].count;
						if (adventure.room.resources[name].count < 1) {
							adventure.room.resources[name] = 0;
						}
						result = {
							content: `${interaction.member.displayName} takes a ${name}. There are ${updatedCount} remaining.`
						}
					} else {
						result = {
							content: `You can only carry ${adventure.getWeaponCapacity()} weapons at a time. Pick one to replace with the ${name}:`,
							components: [new MessageActionRow().addComponents(...delver.weapons.map((weapon, weaponIndex) => {
								return new MessageButton().setCustomId(`replaceweapon-${name}-${weaponIndex}-false`)
									.setLabel(`Discard ${weapon.name}`)
									.setStyle("SECONDARY")
							}))],
							ephemeral: true
						};
					}
				}
				break;
		}
		if (result) {
			interaction.reply(result).then(() => {
				let roomUI = [generateLootRow(adventure), generateRoutingRow(adventure)];
				interaction.message.edit({ components: roomUI });
				updateRoomHeader(adventure, interaction.message);
				setAdventure(adventure);
			});
		} else {
			interaction.update({ content: "\u200B" });
		}
	} else {
		interaction.reply({ content: "Please take loot in adventures you've joined.", ephemeral: true });
	}
}
