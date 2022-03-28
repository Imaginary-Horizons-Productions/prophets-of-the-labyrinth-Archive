const { MessageActionRow, MessageSelectMenu } = require('discord.js');
const Button = require('../../Classes/Button.js');
const { getChallenge } = require('../Challenges/_challengeDictionary.js');

module.exports = new Button("startingchallenges");

module.exports.execute = (interaction, args) => {
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
}
