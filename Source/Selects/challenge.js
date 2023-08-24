const { Interaction } = require('discord.js');
const Select = require('../../Classes/Select.js');
const { getAdventure, setAdventure } = require('../adventureDAO.js');
const { getChallenge } = require('../Challenges/_challengeDictionary.js');
const { editButtons, consumeRoomActions } = require('../roomDAO.js');

const customId = "challenge";
module.exports = new Select(customId,
	/** Apply the selected challenge to the adventure
	 * @param {Interaction} interaction
	 * @param {string[]} args
	 */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channelId);
		if (!adventure.delvers.some(delver => delver.id == interaction.user.id)) {
			interaction.reply({ content: "You aren't in this adventure.", ephemeral: true });
			return;
		}

		if (adventure?.room.resources.roomAction.count > 0) {
			const [challengeName] = interaction.values;
			const { intensity, duration, reward } = getChallenge(challengeName);
			if (adventure.challenges[challengeName]) {
				adventure.challenges[challengeName].intensity += intensity;
				adventure.challenges[challengeName].duration += duration;
				adventure.challenges[challengeName].reward += reward;
			} else {
				adventure.challenges[challengeName] = { intensity, duration, reward };
			}
			interaction.channel.messages.fetch(adventure.messageIds.room).then(roomMessage => {
				const { embeds, remainingActions } = consumeRoomActions(adventure, roomMessage.embeds, 1);
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
	});
