const { MessageEmbed } = require('discord.js');
const Command = require('../../Classes/Command.js');

const options = [
	{ type: "User", name: "user", description: "The user to look up (yourself if blank)", required: false, choices: {} }
];
module.exports = new Command("stats", "Get the stats for a user or yourself", false, false, options);

// imports from files that depend on /Config
let getArtifactCounts, getPlayer;
module.exports.injectConfig = function (isProduction) {
	({ getArtifactCounts } = require('../Artifacts/_artifactDictionary.js').injectConfigArtifacts(isProduction));
	({ getPlayer } = require('../playerDAO.js').injectConfig(isProduction));
	return this;
}

module.exports.execute = (interaction) => {
	// Get the stats on a user
	let player = getPlayer(interaction.user.id, interaction.guild.id);
	let totalArtifacts = getArtifactCounts();
	let embed = new MessageEmbed()
		.setTitle("Player Stats")
		.setDescription(`Total Score: ${Object.values(player.scores).reduce((total, current) => total += current)}`)
		.addField("Artifacts Collected", `${Object.values(player.artifacts).length}/${totalArtifacts} Artifacts (${Math.floor(Object.values(player.artifacts).length / totalArtifacts * 100)}%)`)
		.setFooter({ text: "Imaginary Horizons Productions", iconURL: "https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png" });
	interaction.reply({ embeds: [embed], ephemeral: true })
		.catch(console.error);
}
