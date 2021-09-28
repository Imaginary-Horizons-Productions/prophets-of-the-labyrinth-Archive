const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const Adventure = require('../../Classes/Adventure.js');
const Command = require('../../Classes/Command.js');
const Delver = require('../../Classes/Delver.js');
const { getPlayer } = require('../playerDAO.js');
const { setAdventure, nextRandomNumber } = require("../adventureDAO.js");
const { getGuild } = require('../guildDAO.js');

module.exports = new Command("delve", "Start a new adventure", false, false);
module.exports.data.addStringOption(option => option.setName("seed").setDescription("The value to base the random events of the run on").setRequired(false));

module.exports.execute = (interaction) => {
	// Start a new adventure
	let guildProfile = getGuild(interaction.guild.id);
	if (interaction.channel.id === guildProfile.centralId) {
		let leader = getPlayer(interaction.user.id, interaction.guild.id);
		interaction.guild.channels.fetch(guildProfile.categoryId).then(category => {
			let adventure = new Adventure(interaction.options.getString("seed"));
			let descriptors = ["Shining", "New", "Dusty", "Old", "Floating", "Undersea", "Future"];
			let locations = ["Adventure", "Castle", "Labyrinth", "Ruins", "Plateau", "Dungeon", "Maze", "Fortress"];
			let elements = ["Fire", "Water", "Earth", "Wind", "Light", "Darkness"];
			adventure.setName(`${descriptors[nextRandomNumber(adventure, descriptors.length, "general")]} ${locations[nextRandomNumber(adventure, locations.length, "general")]} of ${elements[nextRandomNumber(adventure, elements.length, "general")]}`);
			interaction.guild.channels.create(adventure.name, {
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
					} //TODO #16 allow view channel for moderators
				]
			}).then(channel => {
				let embed = new MessageEmbed()
					.setTitle(adventure.name)
					.setDescription("A new adventure is starting!")
					.addField("1 Party Member", `Leader: ${interaction.member}`)
					.setFooter("Imaginary Horizons Productions", "https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png")
				let join = new MessageActionRow()
					.addComponents(
						new MessageButton()
							.setCustomId(`join-${channel.id}`)
							.setLabel("Join")
							.setStyle("PRIMARY")
					)
				interaction.reply({ embeds: [embed], components: [join], fetchReply: true }).then(message => {
					adventure.setId(channel.id)
						.setStartMessageID(message.id)
						.setLeader(new Delver(interaction.user.id, channel.id));
					setAdventure(adventure);
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
