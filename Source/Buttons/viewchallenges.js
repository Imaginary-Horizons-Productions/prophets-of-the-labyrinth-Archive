const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const Button = require('../../Classes/Button.js');
const { getAdventure } = require('../adventureDAO.js');
const { getChallenge } = require('../Challenges/_challengeDictionary.js');

const customId = "viewchallenges";
module.exports = new Button(customId,
	/** Roll challenge options for party to select */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channel.id);
		if (!adventure?.delvers.some(delver => delver.id == interaction.user.id)) {
			interaction.reply({ content: "This adventure isn't active or you aren't participating in it.", ephemeral: true });
			return;
		}

		const options = [];
		Object.values(adventure.room.resources).forEach(resource => {
			if (resource.resourceType === "challenge") {
				const challengeName = resource.name;
				const challenge = getChallenge(challengeName);
				options.push({ label: challengeName, description: challenge.dynamicDescription(challenge.intensity, challenge.duration, challenge.reward), value: challengeName });
			}
		})
		const components = [new ActionRowBuilder().addComponents(
			new StringSelectMenuBuilder().setCustomId("challenge")
				.setPlaceholder("Select a challenge...")
				.addOptions(options)
		)];
		interaction.reply({ content: "Shoot for glory (and higher scores)! Add a challenge to the run:", components, ephemeral: true });
	}
);
