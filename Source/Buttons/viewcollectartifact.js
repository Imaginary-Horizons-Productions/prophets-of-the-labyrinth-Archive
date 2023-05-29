const Button = require('../../Classes/Button.js');
const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { getPlayer } = require('../playerDAO.js');
const { getAdventure } = require('../adventureDAO.js');
const { getArtifact } = require('../Artifacts/_artifactDictionary.js');

const id = "viewcollectartifact";
module.exports = new Button(id, (interaction, args) => {
	// Send the player a message with a select an artifact to collect
	let adventure = getAdventure(interaction.channel.id);
	let playerProfile = getPlayer(interaction.user.id, interaction.guild.id);
	let user = adventure.delvers.find(delver => delver.id == interaction.user.id);
	if (user) {
		if (!playerProfile.artifacts[interaction.channelId]) {
			let options = [];
			for (const artifactName in adventure.artifacts) {
				if (!Object.values(playerProfile.artifacts).includes(artifactName)) {
					let description = getArtifact(artifactName).dynamicDescription(1);
					options.push({
						label: artifactName,
						description,
						value: artifactName
					})
				}
			}
			if (options.length) {
				interaction.reply({
					content: "Select an artifact to keep from this adventure.",
					components: [new ActionRowBuilder().addComponents(
						new StringSelectMenuBuilder()
							.setCustomId("collectartifact")
							.setPlaceholder("Select an artifact...")
							.addOptions(options)
							.setDisabled(options.length < 1)
					)],
					ephemeral: true
				});
			} else {
				interaction.reply({
					content: "You have already collected all of the artifacts the party obtained in this adventure.",
					components: [new ActionRowBuilder().addComponents(
						new StringSelectMenuBuilder()
							.setCustomId("collectartifact")
							.setPlaceholder("Select an artifact...")
							.addOptions([{
								label: "If the menu is stuck, switch channels and come back.",
								value: "placeholder"
							}])
							.setDisabled(true)
					)],
					ephemeral: true
				});
			}
		} else {
			interaction.reply({ content: "You've already collected an artifact from this adventure.", ephemeral: true });
		}
	} else {
		interaction.reply({ content: "You don't appear to be signed up for this adventure.", ephemeral: true });
	}
});
