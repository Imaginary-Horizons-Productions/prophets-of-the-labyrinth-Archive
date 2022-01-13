const { MessageEmbed } = require('discord.js');
const Select = require('../../Classes/Select.js');
const { getArtifact } = require('../Artifacts/_artifactDictionary.js');

module.exports = new Select("artifact");

module.exports.execute = (interaction, args) => {
	// Provide information about the selected artifact
	const [artifactName, artifactCount] = interaction.values[0].split("-");
	let artifact = getArtifact(artifactName);
	let embed = new MessageEmbed()
		.setTitle(artifactName)
		.setDescription(artifact.description.replace(/@{copies}/g, artifactCount))
		.addField("Element", artifact.element)
		.setFooter({ text: "Imaginary Horizons Productions", iconURL: "https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png" });
	if (artifact.flavorText.length) {
		embed.addField(...artifact.flavorText);
	}
	interaction.reply({ embeds: [embed], ephemeral: true });
}
