const { MessageEmbed } = require('discord.js');
const { SAFE_DELIMITER } = require('../../constants.js');
const Select = require('../../Classes/Select.js');
const { getArtifact } = require('../Artifacts/_artifactDictionary.js');
const { getAdventure } = require('../adventureDAO.js');

const id = "artifact";
module.exports = new Select(id, (interaction, args) => {
	// Provide information about the selected artifact
	const [artifactName, artifactCount] = interaction.values[0].split(SAFE_DELIMITER);
	let artifact = getArtifact(artifactName);
	let embed = new MessageEmbed()
		.setTitle(`${artifactName} x ${artifactCount}`)
		.setDescription(artifact.dynamicDescription(artifactCount))
		.addField("Element", artifact.element)
		.setFooter({ text: "Imaginary Horizons Productions", iconURL: "https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png" });
	if (artifact.flavorText.length) {
		embed.addField(...artifact.flavorText);
	}
	let adventure = getAdventure(interaction.channel.id);
	let artifactCopy = Object.assign({}, adventure.artifacts[artifactName]);
	delete artifactCopy["count"];
	Object.entries(artifactCopy).forEach(entry => {
		embed.addField(entry[0], entry[1].toString());
	})
	interaction.reply({ embeds: [embed], ephemeral: true });
});
