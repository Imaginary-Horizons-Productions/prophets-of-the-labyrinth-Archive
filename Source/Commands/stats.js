const { MessageEmbed } = require('discord.js');
const Command = require('../../Classes/Command.js');
const { isSponsor } = require('../../helpers.js');
const { getArtifactCounts } = require('../Artifacts/_artifactDictionary.js');
const { getGuild } = require('../guildDAO.js');
const { getPlayer } = require('../playerDAO.js');

const id = "stats";
const options = [
	{ type: "User", name: "user", description: "The user's mention", required: false, choices: [] }
];
module.exports = new Command(id, "Get the stats for a user (default: yourself)", false, false, options);

module.exports.execute = (interaction) => {
	// Get the stats on a user
	const user = interaction.options.getUser(options[0].name) || interaction.user;
	const { guildId } = interaction;
	let availability = getGuild(guildId)?.adventuring.has(user.id) ? "❌ Out on adventure" : "🟢 Available for adventure";
	if (isSponsor(user.id)) {
		availability = "💎 Premium (available for adventure)";
	}
	let player = getPlayer(user.id, guildId);
	let totalArtifacts = getArtifactCounts();
	let embed = new MessageEmbed().setAuthor({ name: availability })
		.setTitle("Player Stats")
		.setDescription(`Total Score: ${Object.values(player.scores).reduce((total, current) => total += current)}`)
		.addFields({ name: "Artifacts Collected", value: `${Object.values(player.artifacts).length}/${totalArtifacts} Artifacts (${Math.floor(Object.values(player.artifacts).length / totalArtifacts * 100)}%)` })
		.setFooter({ text: "Imaginary Horizons Productions", iconURL: "https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png" });
	interaction.reply({ embeds: [embed], ephemeral: true })
		.catch(console.error);
}
