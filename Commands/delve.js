const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const Adventure = require('../Classes/Adventure.js');
const Command = require('../Classes/Command.js');
const { getPlayer } = require('../playerDictionary.js');
const { startAdventure } = require("../adventureDictionary.js");

var command = new Command("delve", "Start a new adventure", false, false);

command.execute = (interaction) => {
	// Start a new adventure
	let adventureId = interaction.user.id; //TODO use new private text channel's id
	let leader = getPlayer(interaction.user.id, interaction.guild.id);
	let embed = new MessageEmbed()
		.setDescription("A new adventure is starting!")
	let buttons = new MessageActionRow()
		.addComponents(
			new MessageButton()
				.setCustomId("join")
				.setLabel("Join")
				.setStyle("PRIMARY"),
			new MessageButton()
				.setCustomId("start")
				.setLabel("Start!")
				.setStyle("SUCCESS")
		)
	interaction.reply({ embeds: [embed], components: [buttons], fetchReply: true }).then(message => {
		startAdventure(new Adventure(adventureId, message.id, leader));
	}).catch(console.error);
}

module.exports = command;
