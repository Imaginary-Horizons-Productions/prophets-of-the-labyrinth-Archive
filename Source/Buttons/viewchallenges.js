const { MessageActionRow, MessageSelectMenu } = require('discord.js');
const Button = require('../../Classes/Button.js');
const { getAdventure } = require('../adventureDAO.js');
const { getChallenge } = require('../Challenges/_challengeDictionary.js');

const id = "viewchallenges";
module.exports = new Button(id, (interaction, args) => {
	// Roll challenge options for party to select
	let adventure = getAdventure(interaction.channel.id);
	if (adventure.delvers.some(delver => delver.id === interaction.user.id)) {
		if (interaction.user.id === adventure.leaderId) {
			let options = [];
			Object.values(adventure.room.resources).forEach(resource => {
				if (resource.resourceType === "challenges") {
					let challengeName = resource.name;
					const challenge = getChallenge(challengeName);
					options.push({ label: challengeName, description: challenge.dynamicDescription(challenge.intensity, challenge.duration, challenge.reward), value: challengeName });
				}
			})
			let components = [new MessageActionRow().addComponents(
				new MessageSelectMenu().setCustomId("challenge")
					.setPlaceholder("Select a challenge...")
					.addOptions(options)
			)];
			interaction.reply({ content: "Shoot for glory (and higher scores)! Add a challenge to the run:", components, ephemeral: true });
		} else {
			interaction.reply({ content: "Please ask the party leader to set challenges.", ephemeral: true });
		}
	} else {
		interaction.reply({ content: "You don't appear to be signed up for this adventure.", ephemeral: true });
	}
});
