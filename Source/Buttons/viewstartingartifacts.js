const Button = require('../../Classes/Button.js');
const { ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { SAFE_DELIMITER, MAX_SELECT_OPTIONS } = require('../../constants.js');
const { getPlayer } = require('../playerDAO.js');
const { getAdventure } = require('../adventureDAO.js');
const { getArtifact, getAllArtifactNames } = require('../Artifacts/_artifactDictionary.js');

const id = "viewstartingartifacts";
module.exports = new Button(id, (interaction, args) => {
	// Send the player a message with a select a starting artifact
	const adventure = getAdventure(interaction.channelId);
	const playerProfile = getPlayer(interaction.user.id, interaction.guild.id);
	const delver = adventure.delvers.find(delver => delver.id === interaction.user.id);
	if (delver) {
		const options = [{ label: "None", description: "Deselect your picked starting artifact", value: "None" }];

		const artifactPool = getAllArtifactNames();
		let start = parseInt(interaction.user.id) % adventure.rnTable.length;
		const artifactsRolledSoFar = new Set();
		const playerArtifactCollection = Object.values(playerProfile.artifacts);
		for (let i = 0; i < MAX_SELECT_OPTIONS - options.length; i++) {
			const digits = Math.ceil(Math.log2(artifactPool.length) / Math.log2(12));
			const end = (start + digits) % adventure.rnTable.length;
			const max = 12 ** digits;
			const sectionLength = max / artifactPool.length;
			const roll = parseInt(adventure.rnTable.slice(start, end), 12);
			const rolledArtifact = artifactPool[Math.floor(roll / sectionLength)];
			if (!artifactsRolledSoFar.has(rolledArtifact) && playerArtifactCollection.includes(artifact)) {
				artifactsRolledSoFar.add(rolledArtifact);
				options.push({
					label: artifact,
					description: getArtifact(artifact).dynamicDescription(1),
					value: artifact
				})
			}
			start++;
		}

		const artifactSelect = [new ActionRowBuilder().addComponents(
			new StringSelectMenuBuilder()
				.setCustomId("startingartifact")
				.setPlaceholder("Select an artifact...")
				.addOptions(options)
		)];
		interaction.reply({ content: "Select an artifact from your collection to start with! Each player will have a different set of artifacts to select from.", components: artifactSelect, ephemeral: true });
	} else {
		let join = new ActionRowBuilder().addComponents(
			new ButtonBuilder().setCustomId(`join${SAFE_DELIMITER}${interaction.guildId}${SAFE_DELIMITER}${interaction.channelId}${SAFE_DELIMITER}aux`)
				.setLabel("Join")
				.setStyle(ButtonStyle.Success));
		interaction.reply({ content: `You don't appear to be signed up for this adventure. You can join with the button below:`, components: [join], ephemeral: true });
	}
});
