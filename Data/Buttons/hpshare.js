const { MessageEmbed } = require('discord.js');
const Button = require('../../Classes/Button.js');
const { getAdventure, nextRoom, completeAdventure, updateRoomHeader } = require('../adventureDAO.js');
const { gainHealth, dealDamage } = require("../combatantDAO.js");

module.exports = new Button("hpshare");

module.exports.execute = (interaction, args) => {
	// Take hp from user, give to party members
	let adventure = getAdventure(interaction.channel.id);
	adventure.delvers.forEach(delver => {
		if (delver.id !== interaction.user.id) {
			gainHealth(delver, 5, adventure.room.enemyTitles);
		}
	})
	dealDamage(adventure.delvers.find(delver => delver.id == interaction.user.id), null, 10, "untyped", adventure).then(damageText => {
		updateRoomHeader(adventure, interaction.message);
		return interaction.reply(`${damageText} Everyone else gains 5 hp.`);
	}).then(() => {
		if (adventure.lives > 0) {
			nextRoom(adventure, interaction.channel);
		} else {
			completeAdventure(adventure, interaction.channel, new MessageEmbed().setTitle("Defeat"));
		}
	})
	interaction.message.edit({ components: [] })
		.catch(console.error);
}
