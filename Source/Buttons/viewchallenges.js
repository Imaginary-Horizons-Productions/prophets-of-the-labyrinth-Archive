const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const Button = require('../../Classes/Button.js');
const { getAdventure } = require('../adventureDAO.js');
const { getChallenge } = require('../Challenges/_challengeDictionary.js');

const customId = "viewchallenges";
module.exports = new Button(customId, (interaction, args) => {
	// Roll challenge options for party to select
	const adventure = getAdventure(interaction.channel.id);
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
});
