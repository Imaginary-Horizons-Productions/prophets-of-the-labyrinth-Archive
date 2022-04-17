const Select = require('../../Classes/Select.js');
const { getAdventure, setAdventure } = require('../adventureDAO.js');
const { getChallenge } = require('../Challenges/_challengeDictionary.js');

module.exports = new Select("startingchallenges");

module.exports.execute = (interaction, args) => {
	let adventure = getAdventure(interaction.channelId);
	if (adventure) {
		if (interaction.user.id === adventure.leaderId) {
			if (interaction.values.includes("None")) {
				adventure.challenges = {};
				interaction.channel.fetchStarterMessage().then(starterMessage => {
					let embed = starterMessage.embeds[0];
					let fieldIndex = embed.fields.findIndex(field => field.name === "Challenges");
					if (fieldIndex !== -1) {
						embed.spliceFields(fieldIndex, 1);
					}
					starterMessage.edit({ embeds: [embed] });
				})
				interaction.update({ components: [] });
				interaction.channel.send({ content: "Starting Challenges have been cleared for this adventure." });
			} else {
				interaction.values.forEach(challengeName => {
					const challenge = getChallenge(challengeName);
					adventure.challenges[challengeName] = { intensity: challenge.intensity, duration: challenge.duration };
				})
				interaction.channel.fetchStarterMessage().then(starterMessage => {
					let embed = starterMessage.embeds[0];
					let challengesText = Object.keys(adventure.challenges).join("\n• ");
					let fieldIndex = embed.fields.findIndex(field => field.name === "Challenges");
					if (fieldIndex !== -1) {
						embed.spliceFields(fieldIndex, 1, { name: "Challenges", value: `• ${challengesText}` })
					} else {
						embed.addField("Challenges", `• ${challengesText}`);
					}
					starterMessage.edit({ embeds: [embed] });
				})
				interaction.update({ components: [] });
				interaction.channel.send({ content: `The following challenges have been added to this adventure: "${interaction.values.join("\", \"")}"` });
			}
			setAdventure(adventure);
		} else {
			interaction.reply({ content: "Please ask the party leader to set challenges.", ephemeral: true });
		}
	} else {
		interaction.reply({ content: "This adventure seems to have already ended.", ephemeral: true });
	}
}
