const { MessageActionRow, MessageSelectMenu } = require('discord.js');
const Button = require('../../Classes/Button.js');
const { getAdventure } = require("../adventureDAO.js").initialize(true);
const { getWeaponProperty } = require('../Weapons/_weaponDictionary.js');

module.exports = new Button("repair");

module.exports.execute = (interaction, args) => {
	// All the user to select a weapon to regain uses on
	let adventure = getAdventure(interaction.channel.id);
	let user = adventure.delvers.find(delver => delver.id === interaction.user.id);
	if (user) {
		let weaponOptions = [];
		user.weapons.forEach((weapon, index) => {
			let maxUses = getWeaponProperty(weapon.name, "maxUses");
			if (weapon.uses < maxUses) {
				let value = Math.min(Math.ceil(maxUses / 2), maxUses - weapon.uses);
				weaponOptions.push({
					label: weapon.name,
					description: `Regain ${value} uses`,
					value: `${weapon.name}-${index}-${value}`
				})
			}
		})
		if (adventure.room.resources.forgeSupplies.count > 0) {
			if (weaponOptions.length > 0) {
				let upgradeSelect = new MessageActionRow().addComponents(
					new MessageSelectMenu().setCustomId(`repair-${interaction.message.id}`)
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
