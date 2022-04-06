const Select = require('../../Classes/Select.js');
const { getAdventure, setAdventure } = require('../adventureDAO.js');
const { getChallenge } = require('../Challenges/_challengeDictionary.js');
const { editButton } = require('../roomDAO.js');

module.exports = new Select("challenge");

module.exports.execute = (interaction, args) => {
	let adventure = getAdventure(interaction.channelId);
	if (adventure) {
		const [challengeName] = interaction.values;
		const challenge = getChallenge(challengeName);
		if (adventure.challenges[challengeName]) {
			adventure.challenges[challengeName].intensity += challenge.intensity;
			adventure.challenges[challengeName].duration += challenge.duration;
			adventure.challenges[challengeName].reward += challenge.reward;
		} else {
			adventure.challenges[challengeName] = { intensity: challenge.intensity, duration: challenge.duration, reward: challenge.reward };
		}
		interaction.update({ components: [] });
		interaction.channel.messages.fetch(adventure.messageIds.room).then(roomMessage => {
			roomMessage.edit({ components: editButton(roomMessage, "challenge", true, "✔️", challengeName) });
		})
		setAdventure(adventure);
		interaction.channel.send({ content: `The party takes on a new challenge: ${challengeName}` });
	} else {
		interaction.reply({ content: "This adventure seems to have already ended.", ephemeral: true });
	}
}
