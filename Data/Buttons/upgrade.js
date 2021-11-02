const { MessageActionRow, MessageSelectMenu } = require('discord.js');
const Button = require('../../Classes/Button.js');
const { getAdventure } = require("./../adventureDAO.js");

module.exports = new Button("upgrade");

module.exports.execute = (interaction, args) => {
	// Present the user with an opportunity to upgrade a weapon
	let adventure = getAdventure(interaction.channel.id);
	let user = adventure.delvers.find(delver => delver.id === interaction.user.id);
	let weaponOptions = [];
	user.weapons.forEach((weapon, i) => {
		if (weapon.upgrades.length > 0) {
			weaponOptions.push({
				label: weapon.name,
				description: `Possible upgrades: ${weapon.upgrades.join(", ")}`,
				value: `${i}`
			})
		}
	})
	if (adventure.room.loot.randomUpgrade > 0) {
		if (weaponOptions.length > 0) {
			let upgradeSelect = new MessageActionRow().addComponents(
				new MessageSelectMenu().setCustomId("randomupgrade")
					.setPlaceholder("Pick a weapon to randomly upgrade...")
					.setOptions(weaponOptions)
			)
			interaction.reply({ content: `You can pick a weapon to upgrade, but you're not sure what you'll get:`, components: [upgradeSelect], ephemeral: true });
		} else {
			interaction.reply({ content: "You don't have any weapons that can be upgraded.", ephemeral: true });
		}
	} else {
		interaction.reply({ content: "This upgrade has already been used.", ephemeral: true });
	}
}
