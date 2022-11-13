const { Interaction } = require('discord.js');
const Select = require('../../Classes/Select.js');
const { getAdventure, setAdventure } = require('../adventureDAO.js');
const { getChallenge } = require('../Challenges/_challengeDictionary.js');
const { editButtons } = require('../roomDAO.js');

const id = "challenge";
module.exports = new Select(id,
	/** Apply the selected challenge to the adventure
	 * @param {Interaction} interaction
	 * @param {Array<string>} args
	 */
	(interaction, args) => {
		let adventure = getAdventure(interaction.channelId);
		if (adventure) {
			if (adventure.room.resources.roomAction.count > 0) {
				const [challengeName] = interaction.values;
				const { intensity, duration, reward } = getChallenge(challengeName);
				if (adventure.challenges[challengeName]) {
					adventure.challenges[challengeName].intensity += intensity;
					adventure.challenges[challengeName].duration += duration;
					adventure.challenges[challengeName].reward += reward;
				} else {
					adventure.challenges[challengeName] = { intensity, duration, reward };
				}
				const remainingActions = --adventure.room.resources.roomAction.count;
				interaction.channel.messages.fetch(adventure.messageIds.room).then(roomMessage => {
					const embeds = roomMessage.embeds.map(embed =>
						embed.spliceFields(embed.fields.findIndex(field => field.name === "Room Actions"), 1, { name: "Room Actions", value: remainingActions.toString() })
					);
					let components = roomMessage.components;
					if (remainingActions < 1) {
						components = editButtons(components, {
							"viewchallenges": { preventUse: true, label: challengeName, emoji: "✔️" },
							"rest": { preventUse: true, label: "The fire has burned out", emoji: "✖️" }
						})
					}
					return roomMessage.edit({ embeds, components });
				}).then(() => {
					interaction.update({ components: [] });
					setAdventure(adventure);
					interaction.channel.send({ content: `The party takes on a new challenge: ${challengeName}` });
				})
			} else {
				interaction.reply({ content: "No more actions can be taken in this room.", ephemeral: true });
			}
		} else {
			interaction.reply({ content: "This adventure seems to have already ended.", ephemeral: true });
		}
	});
