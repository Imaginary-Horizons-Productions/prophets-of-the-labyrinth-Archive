const Select = require('../../Classes/Select.js');
const { getAdventure } = require('../adventureDAO.js');
const { getChallenge } = require('../Challenges/_challengeDictionary.js');

module.exports = new Select("challenge");

module.exports.execute = (interaction, args) => {
	let adventure = getAdventure(interaction.channelId);
	if (adventure) {
		if (interaction.values.includes("None")) {
			adventure.challenges = {};
			interaction.reply({ content: "Starting Challenges have been cleared for this adventure." });
		} else {
			interaction.values.forEach(challengeName => {
				const challenge = getChallenge(challengeName);
				adventure.challenges[challengeName] = { intensity: challenge.startingValue, duration: challenge.duration };
			})
			interaction.reply({ content: `The following challenges have been added to this adventure: ${interaction.values.join(", ")}` });
		}
	} else {
		interaction.reply({ content: "This adventure seems to have already ended.", ephemeral: true });
	}
}
