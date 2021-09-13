const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const Adventure = require('../../Classes/Adventure.js');
const Command = require('../../Classes/Command.js');
const Delver = require('../../Classes/Delver.js');
const { getPlayer } = require('../playerList.js');
const { setAdventure } = require("../adventureList.js");
const { getGuild } = require('../guildList.js');

var command = new Command("delve", "Start a new adventure", false, false);

command.execute = (interaction) => {
	// Start a new adventure
	let guildProfile = getGuild(interaction.guild.id);
	if (interaction.channel.id === guildProfile.centralId) {
		let leader = getPlayer(interaction.user.id, interaction.guild.id);
		interaction.guild.channels.fetch(guildProfile.categoryId).then(category => {
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
					.setFooter("Imaginary Horizons Productions", "https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png")
				let join = new MessageActionRow()
					.addComponents(
						new MessageButton()
							.setCustomId(`join-${channel.id}`)
							.setLabel("Join")
							.setStyle("PRIMARY")
					)
				interaction.reply({ embeds: [embed], components: [join], fetchReply: true }).then(message => {
					setAdventure(new Adventure(channel.id, message.id, new Delver(interaction.user.id, channel.id)));
					let ready = new MessageActionRow()
						.addComponents(
							new MessageButton()
								.setCustomId(`ready-${channel.id}-${leader.id}`)
								.setLabel("Ready!")
								.setStyle("SUCCESS")
						)
					channel.send({ content: "The adventure will begin when the leader clicks the \"Ready!\" button.", components: [ready] });
				}).catch(console.error);
			})
		})
	} else {
		interaction.reply({ content: `Please start your delves from <#${guildProfile.centralId}>.`, ephemeral: true })
			.catch(console.error);
	}
}

module.exports = command;
