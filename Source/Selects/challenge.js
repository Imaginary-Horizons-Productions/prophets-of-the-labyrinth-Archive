const Select = require('../../Classes/Select.js');
const { getAdventure, setAdventure } = require('../adventureDAO.js');
const { getChallenge } = require('../Challenges/_challengeDictionary.js');
const { editButtons } = require('../roomDAO.js');

const id = "challenge";
module.exports = new Select(id, (interaction, args) => {
	let adventure = getAdventure(interaction.channelId);
	if (adventure) {
		const [challengeName] = interaction.values;
		const { intensity, duration, reward } = getChallenge(challengeName);
		if (adventure.challenges[challengeName]) {
			adventure.challenges[challengeName].intensity += intensity;
			adventure.challenges[challengeName].duration += duration;
			adventure.challenges[challengeName].reward += reward;
		} else {
			adventure.challenges[challengeName] = { intensity, duration, reward };
		}
		interaction.update({ components: [] });
		interaction.channel.messages.fetch(adventure.messageIds.room).then(roomMessage => {
			roomMessage.edit({
				components: editButtons(roomMessage.components, {
					"challenge": { preventUse: true, label: challengeName, emoji: "✔️" },
					"rest": { preventUse: true, label: "The fire has burned out", emoji: "✖️" }
				})
			});
		})
		setAdventure(adventure);
		interaction.channel.send({ content: `The party takes on a new challenge: ${challengeName}` });
	} else {
		interaction.reply({ content: "This adventure seems to have already ended.", ephemeral: true });
	}
});
