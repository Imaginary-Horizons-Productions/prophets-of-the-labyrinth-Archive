const { MessageEmbed } = require('discord.js');
const Command = require('../../Classes/Command.js');
const { isSponsor } = require('../../helpers.js');
const { getArtifactCounts } = require('../Artifacts/_artifactDictionary.js');
const { getGuild } = require('../guildDAO.js');
const { getPlayer } = require('../playerDAO.js');

const options = [
	{ type: "User", name: "user", description: "The user's mention", required: false, choices: [] }
];
module.exports = new Command("stats", "Get the stats for a user (default: yourself)", false, false, options);

module.exports.execute = (interaction) => {
	// Get the stats on a user
	let availability = getGuild(interaction.guildId)?.adventuring.has(interaction.user.id) ? "❌ Out on adventure" : "🟢 Available for adventure";
	if (isSponsor(interaction.user.id)) {
		availability = "💎 Premium (available for adventure)";
	}
	let player = getPlayer(interaction.user.id, interaction.guildId);
	let totalArtifacts = getArtifactCounts();
	let embed = new MessageEmbed().setAuthor({ name: availability })
		.setTitle("Player Stats")
		.setDescription(`Total Score: ${Object.values(player.scores).reduce((total, current) => total += current)}`)
		.addField("Artifacts Collected", `${Object.values(player.artifacts).length}/${totalArtifacts} Artifacts (${Math.floor(Object.values(player.artifacts).length / totalArtifacts * 100)}%)`)
		.setFooter({ text: "Imaginary Horizons Productions", iconURL: "https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png" });
	interaction.reply({ embeds: [embed], ephemeral: true })
		.catch(console.error);
}
