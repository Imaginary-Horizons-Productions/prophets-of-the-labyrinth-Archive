const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const Adventure = require('../Classes/Adventure.js');
const Command = require('../Classes/Command.js');
const { getPlayer } = require('../playerDictionary.js');
const { startAdventure } = require("../adventureDictionary.js");
const { getGuild } = require('../guildDictionary.js');

var command = new Command("delve", "Start a new adventure", false, false);

command.execute = (interaction) => {
	// Start a new adventure
	let leader = getPlayer(interaction.user.id, interaction.guild.id);
	interaction.guild.channels.fetch(getGuild(interaction.guild.id).categoryId).then(category => {
		interaction.guild.channels.create("new adventure", {
			parent: category,
			permissionOverwrites: [
				{
					id: interaction.client.user.id,
					type: 1,
					allow: ["VIEW_CHANNEL"]
				},
				{
					id: interaction.user.id,
					type: 1,
					allow: ["VIEW_CHANNEL"]
				},
				{
					id: interaction.guild.id,
					type: 0,
					deny: ["VIEW_CHANNEL"]
				} //TODO allow view channel for moderators
			]
		}).then(channel => { //TODO adventure name generator
			let embed = new MessageEmbed()
				.setDescription("A new adventure is starting!")
			let buttons = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId(`join-${channel.id}`)
						.setLabel("Join")
						.setStyle("PRIMARY"),
					new MessageButton()
						.setCustomId("start")
						.setLabel("Start!")
						.setStyle("SUCCESS")
				)
			interaction.reply({ embeds: [embed], components: [buttons], fetchReply: true }).then(message => {
				startAdventure(new Adventure(channel.id, message.id, leader));
			}).catch(console.error);
		})
	})
}

module.exports = command;
