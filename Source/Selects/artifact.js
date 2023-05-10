const { EmbedBuilder } = require('discord.js');
const { SAFE_DELIMITER } = require('../../constants.js');
const Select = require('../../Classes/Select.js');
const { getArtifact } = require('../Artifacts/_artifactDictionary.js');
const { getAdventure } = require('../adventureDAO.js');

const id = "artifact";
module.exports = new Select(id, (interaction, args) => {
	// Provide information about the selected artifact
	const [artifactName, artifactCount] = interaction.values[0].split(SAFE_DELIMITER);
	let artifact = getArtifact(artifactName);
	let embed = new EmbedBuilder()
		.setTitle(`${artifactName} x ${artifactCount}`)
		.setDescription(artifact.dynamicDescription(artifactCount))
		.addFields({ name: "Element", value: artifact.element })
		.setFooter({ text: "Imaginary Horizons Productions", iconURL: "https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png" });
	if (artifact.flavorText) {
		embed.addFields(artifact.flavorText);
	}
	let adventure = getAdventure(interaction.channel.id);
	let artifactCopy = Object.assign({}, adventure.artifacts[artifactName]);
	delete artifactCopy["count"];
	Object.entries(artifactCopy).forEach(([statistic, value]) => {
		embed.addFields({ name: statistic, value: value.toString() });
	})
	interaction.reply({ embeds: [embed], ephemeral: true });
});
