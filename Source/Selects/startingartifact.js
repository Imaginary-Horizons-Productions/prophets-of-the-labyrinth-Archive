const Select = require('../../Classes/Select.js');
const { getAdventure, setAdventure } = require('../adventureDAO');
const { MessageActionRow, MessageButton } = require('discord.js');
const { getArtifactDescription } = require('../Artifacts/_artifactDictionary.js');

module.exports = new Select("startingartifact");

module.exports.execute = (interaction, _args) => { //TODONOW reject interactions from adventures that have already started
	// Add the player's delver object to the adventure
	let adventure = getAdventure(interaction.channel.id);
	if (adventure) {
		// Add delver to list (or overwrite)
		let userIndex = adventure.delvers.findIndex(delver => delver.id === interaction.user.id);
		if (userIndex !== -1) {
			let [artifactName] = interaction.values;
			let isSwitching = adventure.delvers[userIndex].startingArtifact !== "";
			adventure.delvers[userIndex].startingArtifact = artifactName;

			// Send confirmation text
			interaction.update({
				content: getArtifactDescription(artifactName).description,
				components: [new MessageActionRow().addComponents(
					interaction.component.setPlaceholder("Pick a different artifact...")
				)]
			});
			interaction.channel.send(`${interaction.user} ${isSwitching ? "has switched to" : "is taking"} ${artifactName} for their starting artifact.`);
			setAdventure(adventure);
		} else {
			let join = new MessageActionRow().addComponents(
				new MessageButton().setCustomId(`join-${interaction.guildId}-${interaction.channelId}`)
					.setLabel("Join")
					.setStyle("SUCCESS"));
			interaction.reply({ content: `You don't appear to be signed up for this adventure. You can join with the button below:`, components: [join], ephemeral: true });
		}
	} else {
		interaction.reply({ content: "This adventure seems to be over already.", ephemeral: true });
	}
}
