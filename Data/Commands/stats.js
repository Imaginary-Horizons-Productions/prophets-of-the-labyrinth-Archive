const { MessageEmbed } = require('discord.js');
const Command = require('../../Classes/Command.js');
const { getPlayer } = require('../playerDictionary.js');

var command = new Command("stats", "Get the stats for a user or yourself", false, false);
command.data.addUserOption(option => option.setName("user").setDescription("The user to look up (yourself if blank)").setRequired(false));

command.execute = (interaction) => {
	// Get the stats on a user
	let player = getPlayer(interaction.user.id, interaction.guild.id);
	let embed = new MessageEmbed()
		.setTitle("Player Stats")
		.setDescription(`Total Score: ${Object.values(player.score).reduce((total, current) => total += current)}`)
		.setFooter("Imaginary Horizons Productions", "https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png");
	interaction.reply({ embeds: [embed], ephemeral: true })
		.catch(console.error);
}

module.exports = command;
