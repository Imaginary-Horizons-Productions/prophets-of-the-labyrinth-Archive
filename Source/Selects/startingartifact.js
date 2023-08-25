const Select = require('../../Classes/Select.js');
const { getAdventure, setAdventure } = require('../adventureDAO');
const { ActionRowBuilder } = require('discord.js');
const { getArtifact } = require('../Artifacts/_artifactDictionary.js');

const id = "startingartifact";
module.exports = new Select(id, (interaction, args) => {
	// Set the player's starting artifact
	let adventure = getAdventure(interaction.channel.id);
	if (adventure?.state === "config") {
		// Add delver to list (or overwrite)
		let delver = adventure.delvers.find(delver => delver.id === interaction.user.id);
		let [artifactName] = interaction.values;
		if (artifactName === "None") {
			delver.startingArtifact = "";
			interaction.channel.send(`${interaction.user} is not planning to bring a starting artifact.`);
			interaction.update({
				content: "Forgoing a starting artifact will increase your end of adventure score multiplier (up to 2x if no one takes a starting artifact).",
				components: [new ActionRowBuilder().addComponents(
					new StringSelectMenuBuilder(interaction.component.data).setPlaceholder("Pick an artifact after all...")
				)]
			});
		} else {
			let isSwitching = delver.startingArtifact !== "";
			delver.startingArtifact = artifactName;

			// Send confirmation text
			interaction.update({
				content: getArtifact(artifactName).dynamicDescription(1),
				components: [new ActionRowBuilder().addComponents(
					new StringSelectMenuBuilder(interaction.component.data).setPlaceholder("Pick a different artifact...")
				)]
			});
			interaction.channel.send(`${interaction.user} ${isSwitching ? "has switched to" : "is taking"} ${artifactName} for their starting artifact.`);
		}
		setAdventure(adventure);
	} else {
		interaction.reply({ content: "A valid adventure could not be found.", ephemeral: true });
	}
});
