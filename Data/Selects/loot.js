const { MessageActionRow, MessageButton } = require('discord.js');
const Select = require('../../Classes/Select.js');
const { getAdventure, updateRoomHeader, setAdventure } = require('../adventureDAO.js');
const { editSelectOption } = require('../roomDAO.js');
const { buildWeaponDescription, getWeaponProperty } = require('../Weapons/_weaponDictionary.js');

module.exports = new Select("loot");

module.exports.execute = (interaction, args) => {
	// Move the selected loot into party/delver's inventory
	let adventure = getAdventure(interaction.channel.id);
	let delver = adventure.delvers.find(delver => delver.id === interaction.user.id);
	if (delver) {
		let result;
		interaction.values.forEach(lootEntry => {
			const [type, name, index] = lootEntry.split("-");
			switch (type) {
				case "gold":
					adventure.gainGold(adventure.room.loot.gold);
					interaction.message.edit({ components: editSelectOption(interaction.message, interaction.customId, `${adventure.room.loot.gold} Gold`, null, "All looted") }).then(() => {
						interaction.channel.send(`The party acquires ${adventure.room.loot.gold} gold.`);
						updateRoomHeader(adventure, interaction.message);
						adventure.room.loot.gold = 0;
						setAdventure(adventure);
					});
					break;
				case "artifact":
					let lootIndex = `artifact-${name}`;
					let artifactCount = adventure.room.loot[lootIndex];
					adventure.gainArtifact(name, artifactCount);
					interaction.message.edit({ components: editSelectOption(interaction.message, interaction.customId, `${name} x ${artifactCount}`, null, "All looted") }).then(() => {
						interaction.channel.send(`The party acquires ${name} x ${artifactCount}.`);
						updateRoomHeader(adventure, interaction.message);
						delete adventure.room.loot[lootIndex];
						setAdventure(adventure);
					});
					break;
				case "weapon":
					if (delver.weapons.length < 4) { //TODO #176 create adventure.weaponCapacity() to create Holster artifact and "Can't Carry All This Value" difficulty option
						delver.weapons.push({ name, uses: getWeaponProperty(name, "maxUses") });
						let lootIndex = `weapon-${name}`;
						let optionLabel = `${name} x ${adventure.room.loot[lootIndex]}`;  // generate label to look for before decrementing
						let remaining = --adventure.room.loot[lootIndex];
						let replacementOption;
						if (remaining !== 0) {
							replacementOption = {
								label: `${name} x ${remaining}`,
								description: buildWeaponDescription(name, false),
								value: lootEntry
							};
						} else {
							replacementOption = null;
						}
						interaction.message.edit({ components: editSelectOption(interaction.message, interaction.customId, optionLabel, replacementOption, "All looted") });
						interaction.channel.send({ content: `${interaction.member.displayName} takes a ${name}.${remaining !== 0 ? ` There are ${remaining} remaining.` : ""}` });
						setAdventure(adventure);
					} else {
						result = {
							content: `You can only carry 4 weapons at a time. Pick one to replace with the ${name}:`,
							components: [new MessageActionRow().addComponents(...delver.weapons.map((weapon, weaponIndex) => {
								return new MessageButton().setCustomId(`replaceweapon-${name}-${weaponIndex}-0-`)
									.setLabel(`Discard ${weapon.name}`)
									.setStyle("SECONDARY")
							}))],
							ephemeral: true
						};
					}
					break;
			}
		})
		if (result) {
			interaction.reply(result);
		} else {
			interaction.update({ content: "\u200B" });
		}
	} else {
		interaction.reply({ content: "Please take loot in adventures you've joined.", ephemeral: true });
	}
}
