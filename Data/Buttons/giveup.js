const { MessageEmbed } = require('discord.js');
const Button = require('../../Classes/Button.js');
const { completeAdventure, getAdventure } = require('../adventureDAO.js');

module.exports = new Button("giveup");

module.exports.execute = (interaction, args) => {
	// Give up on the current adventure
	let adventure = getAdventure(interaction.channel.id);
	if (interaction.user.id === adventure.leaderId) {
		completeAdventure(adventure, interaction.channel, new MessageEmbed().setTitle("Defeat"));
	} else {
		interaction.reply({ content: "Please ask the leader to end the adventure.", ephemeral: true });
	}
}
