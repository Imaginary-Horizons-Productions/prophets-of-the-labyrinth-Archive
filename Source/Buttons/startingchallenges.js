const { MessageActionRow, MessageSelectMenu, MessageButton } = require('discord.js');
const Button = require('../../Classes/Button.js');
const { SAFE_DELIMITER } = require('../../helpers.js');
const { getAdventure } = require('../adventureDAO.js');
const { getChallenge } = require('../Challenges/_challengeDictionary.js');

module.exports = new Button("startingchallenges");

module.exports.execute = (interaction, _args) => {
	let adventure = getAdventure(interaction.channel.id);
	if (adventure.delvers.some(delver => delver.id === interaction.user.id)) {
		if (interaction.user.id === adventure.leaderId) {
			let options = [{ label: "None", description: "Deselect previously selected challenges", value: "None" }];
			["Can't Hold All this Value", "Restless"].forEach(challengeName => {
				const challenge = getChallenge(challengeName);
				options.push({ label: challengeName, description: challenge.dynamicDescription(challenge.intensity, challenge.duration), value: challengeName });
			})
			let components = [new MessageActionRow().addComponents(
				new MessageSelectMenu().setCustomId("challenge")
					.setPlaceholder("Select challenge(s)...")
					.setMinValues(1)
					.setMaxValues(options.length)
					.addOptions(options)
			)];
			interaction.reply({ content: "Shoot for glory (and higher scores)! Add challenges to the run:", components, ephemeral: true });
		} else {
			interaction.reply({ content: "Please ask the party leader to set challenges.", ephemeral: true });
		}
	} else {
		interaction.reply({
			content: `You don't appear to be signed up for this adventure. You can join with the button below:`,
			components: [new MessageActionRow().addComponents(
				new MessageButton().setCustomId(`join${SAFE_DELIMITER}${interaction.guildId}${SAFE_DELIMITER}${interaction.channelId}`)
					.setLabel("Join")
					.setStyle("SUCCESS"))],
			ephemeral: true
		});
	}
}
