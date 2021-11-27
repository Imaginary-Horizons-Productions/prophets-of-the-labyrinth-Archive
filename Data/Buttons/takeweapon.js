const { MessageActionRow } = require('discord.js');
const Button = require('../../Classes/Button.js');
const { setAdventure, getAdventure } = require('../adventureDAO.js');
const { getWeaponProperty } = require('../Weapons/_weaponDictionary.js');

module.exports = new Button("takeweapon");

module.exports.execute = (interaction, [weaponName]) => {
	// Add the given weapon the the delver's weapon list
	let adventure = getAdventure(interaction.channel.id);
	let delver = adventure.delvers.find(delver => delver.id === interaction.user.id);
	if (Object.keys(delver.weapons).length < 4) {
		delver.weapons[weaponName] = getWeaponProperty(weaponName, "maxUses");
		let remaining = --adventure.room.loot[`weapon-${weaponName}`];
		interaction.update({
			components: [...interaction.message.components.map(row => {
				return new MessageActionRow().addComponents(...row.components.map(component => {
					if (component.customId.startsWith("takeweapon")) {
						if (remaining !== 0) {
							return component.setLabel(`${weaponName} x${remaining} remaining`);
						} else {
							return component.setLabel(`${weaponName} GET`)
								.setDisabled(true)
								.setEmoji("✔️");
						}
					} else {
						return component;
					}
				}));
			})
			]
		});
		interaction.followUp({ content: `${interaction.member.displayName} takes a ${weaponName}.` });
		setAdventure(adventure);
	} else {
		interaction.reply("You can only carry 4 weapons at a time. (Weapon replacement coming soon).");
	}
}
