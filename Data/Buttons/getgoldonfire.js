const { MessageEmbed } = require('discord.js');
const Button = require('../../Classes/Button.js');
const { getAdventure, completeAdventure, updateRoomHeader, setAdventure } = require('../adventureDAO.js');
const { dealDamage } = require("../combatantDAO.js");

module.exports = new Button("getgoldonfire");

module.exports.execute = (interaction, args) => {
	// Gold +50, HP -100
	let adventure = getAdventure(interaction.channel.id);
	let delver = adventure.delvers.find(delver => delver.id == interaction.user.id);
	if (delver) {
		adventure.gainGold(50);
		dealDamage(delver, null, 100, true, "untyped", adventure).then(damageText => {
			updateRoomHeader(adventure, interaction.message);
			return interaction.reply(`${interaction.user} reaches into the flames and grabs some coin. ${damageText}`);
		}).then(() => {
			if (adventure.lives < 1) {
				completeAdventure(adventure, interaction.channel, new MessageEmbed().setTitle("Defeat"));
			} else {
				setAdventure(adventure);
			}
		});
	} else {
		interaction.reply({ content: "Please burn yourself on gold in adventures you've joined.", ephemeral: true });
	}
}
