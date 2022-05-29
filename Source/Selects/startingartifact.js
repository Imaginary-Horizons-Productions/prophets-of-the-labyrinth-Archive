const Select = require('../../Classes/Select.js');
const { SAFE_DELIMITER } = require('../../helpers.js');
const { getAdventure, setAdventure } = require('../adventureDAO');
const { MessageActionRow, MessageButton } = require('discord.js');
const { getArtifact } = require('../Artifacts/_artifactDictionary.js');

module.exports = new Select("startingartifact");

module.exports.execute = (interaction, args) => {
	// Set the player's starting artifact
	let adventure = getAdventure(interaction.channel.id);
	if (adventure?.state === "config") {
		// Add delver to list (or overwrite)
		let delver = adventure.delvers.find(delver => delver.id === interaction.user.id);
		if (delver) {
			let [artifactName] = interaction.values;
			if (artifactName === "None") {
				delver.startingArtifact = "";
				interaction.channel.send(`${interaction.user} is not planning to bring a starting artifact.`);
				interaction.update({
					content: "Forgoing a starting artifact will increase your end of adventure score multiplier (up to 2x if no one takes a starting artifact).",
					components: [new MessageActionRow().addComponents(
						interaction.component.setPlaceholder("Pick an artifact after all...")
					)]
				});
			} else {
				let isSwitching = delver.startingArtifact !== "";
				delver.startingArtifact = artifactName;

				// Send confirmation text
				interaction.update({
					content: getArtifact(artifactName).dynamicDescription(1),
					components: [new MessageActionRow().addComponents(
						interaction.component.setPlaceholder("Pick a different artifact...")
					)]
				});
				interaction.channel.send(`${interaction.user} ${isSwitching ? "has switched to" : "is taking"} ${artifactName} for their starting artifact.`);
			}
			setAdventure(adventure);
		} else {
			let join = new MessageActionRow().addComponents(
				new MessageButton().setCustomId(`join${SAFE_DELIMITER}${interaction.guildId}${SAFE_DELIMITER}${interaction.channelId}${SAFE_DELIMITER}aux`)
					.setLabel("Join")
					.setStyle("SUCCESS"));
			interaction.reply({ content: `You don't appear to be signed up for this adventure. You can join with the button below:`, components: [join], ephemeral: true });
		}
	} else {
		interaction.reply({ content: "A valid adventure could not be found.", ephemeral: true });
	}
}
