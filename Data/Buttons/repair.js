const { MessageActionRow, MessageSelectMenu } = require('discord.js');
const Button = require('../../Classes/Button.js');
const { getAdventure } = require("../adventureDAO.js");
const { getWeaponProperty } = require('../Weapons/_weaponDictionary.js');

module.exports = new Button("repair");

module.exports.execute = (interaction, args) => {
	// All the user to select a weapon to regain uses on
	let adventure = getAdventure(interaction.channel.id);
	let user = adventure.delvers.find(delver => delver.id === interaction.user.id);
	if (user) {
		let weaponOptions = [];
		for (let weaponName in user.weapons) {
			let maxUses = getWeaponProperty(weaponName, "maxUses");
			if (user.weapons[weaponName] < maxUses) {
				let value = Math.min(Math.ceil(maxUses / 2), maxUses - user.weapons[weaponName]);
				weaponOptions.push({
					label: weaponName,
					description: `Regain ${value} uses`,
					value: `${weaponName}`
				})
			}
		}
		if (adventure.room.loot.forgeSupplies > 0) {
			if (weaponOptions.length > 0) {
				let upgradeSelect = new MessageActionRow().addComponents(
					new MessageSelectMenu().setCustomId("repair")
						.setPlaceholder("Pick a weapon to repair...")
						.setOptions(weaponOptions)
				)
				interaction.reply({ content: "When you repair a weapon, it'll regain half its max uses.", components: [upgradeSelect], ephemeral: true });
			} else {
				interaction.reply({ content: "None of your weapons need repair.", ephemeral: true });
			}
		} else {
			interaction.reply({ content: "The forge's supplies have been exhausted.", ephemeral: true });
		}
	} else {
		interaction.reply({ content: "Please repair weapons in adventures you've joined.", ephemeral: true });
	}
}
