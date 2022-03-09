const Button = require('../../Classes/Button.js');
const { MessageActionRow, MessageSelectMenu, MessageButton } = require('discord.js');
const { getPlayer } = require('../playerDAO.js');
const { getAdventure } = require('../adventureDAO.js');
const { getArtifactDescription } = require('../Artifacts/_artifactDictionary.js');

module.exports = new Button("startingartifact");

module.exports.execute = (interaction, _args) => {
	// Send the player a message with a select a starting artifact
	let adventure = getAdventure(interaction.channel.id);
	let playerProfile = getPlayer(interaction.user.id, interaction.guild.id);
	let user = adventure.delvers.find(delver => delver.id == interaction.user.id);
	if (user) {
		let options = [];
		for (const artifactName of Object.values(playerProfile.artifacts)) {
			let description = getArtifactDescription(artifactName, 1);
			options.push({
				label: artifactName,
				description,
				value: artifactName
			})
		}
		let artifactSelect = [new MessageActionRow().addComponents(
			new MessageSelectMenu()
				.setCustomId("startingartifact")
				.setPlaceholder("Select an artifact...")
				.addOptions(options)
		)];
		interaction.reply({ content: `Select your starting artifact for this adventure! Different artifacts can be collected by completing adventures.`, components: artifactSelect, ephemeral: true });
	} else {
		let join = new MessageActionRow().addComponents(
			new MessageButton().setCustomId(`join-${interaction.guildId}-${interaction.channelId}`)
				.setLabel("Join")
				.setStyle("SUCCESS"));
		interaction.reply({ content: `You don't appear to be signed up for this adventure. You can join with the button below:`, components: [join], ephemeral: true });
	}
}
