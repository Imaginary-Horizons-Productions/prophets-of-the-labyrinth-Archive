const Button = require('../../Classes/Button.js');
const { ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { SAFE_DELIMITER } = require('../../constants.js');
const { getPlayer } = require('../playerDAO.js');
const { getAdventure } = require('../adventureDAO.js');
const { getArtifact } = require('../Artifacts/_artifactDictionary.js');

const id = "viewstartingartifacts";
module.exports = new Button(id, (interaction, args) => {
	// Send the player a message with a select a starting artifact
	let adventure = getAdventure(interaction.channel.id);
	let playerProfile = getPlayer(interaction.user.id, interaction.guild.id);
	let user = adventure.delvers.find(delver => delver.id == interaction.user.id);
	if (user) {
		let options = [{ label: "None", description: "Deselect your picked starting artifact", value: "None" }];
		for (const artifactName of Object.values(playerProfile.artifacts)) {
			let description = getArtifact(artifactName).dynamicDescription(1);
			options.push({
				label: artifactName,
				description,
				value: artifactName
			})
		}
		let artifactSelect = [new ActionRowBuilder().addComponents(
			new StringSelectMenuBuilder()
				.setCustomId("startingartifact")
				.setPlaceholder("Select an artifact...")
				.addOptions(options)
		)];
		interaction.reply({ content: `Select your starting artifact for this adventure! Different artifacts can be collected by completing adventures.`, components: artifactSelect, ephemeral: true });
	} else {
		let join = new ActionRowBuilder().addComponents(
			new ButtonBuilder().setCustomId(`join${SAFE_DELIMITER}${interaction.guildId}${SAFE_DELIMITER}${interaction.channelId}${SAFE_DELIMITER}aux`)
				.setLabel("Join")
				.setStyle(ButtonStyle.Success));
		interaction.reply({ content: `You don't appear to be signed up for this adventure. You can join with the button below:`, components: [join], ephemeral: true });
	}
});
