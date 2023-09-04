const Button = require('../../Classes/Button.js');
const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { MAX_SELECT_OPTIONS } = require('../../constants.js');
const { getPlayer } = require('../playerDAO.js');
const { getAdventure } = require('../adventureDAO.js');
const { getArtifact, getAllArtifactNames } = require('../Artifacts/_artifactDictionary.js');

const customId = "viewstartingartifacts";
module.exports = new Button(customId,
	/** Send the player a message with a select a starting artifact */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channelId);
		if (!adventure?.delvers.some(delver => delver.id == interaction.user.id)) {
			interaction.reply({ content: "This adventure isn't active or you aren't participating in it.", ephemeral: true });
			return;
		}

		const playerProfile = getPlayer(interaction.user.id, interaction.guild.id);
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
			if (!artifactsRolledSoFar.has(rolledArtifact) && playerArtifactCollection.includes(rolledArtifact)) {
				artifactsRolledSoFar.add(rolledArtifact);
				options.push({
					label: rolledArtifact,
					description: getArtifact(rolledArtifact).dynamicDescription(1),
					value: rolledArtifact
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
	}
);
