const { Interaction } = require('discord.js');
const Select = require('../../Classes/Select.js');
const { SAFE_DELIMITER } = require('../../constants.js');
const { getAdventure, setAdventure } = require('../adventureDAO.js');
const { editButtons, consumeRoomActions } = require('../roomDAO.js');

const id = "repair";
module.exports = new Select(id,
	/** Grant half the selected equipment's max uses
	 * @param {Interaction} interaction
	 * @param {Array<string>} args
	 */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channel.id);
		if (adventure.room.resources.roomAction.count > 0) {
			const user = adventure.delvers.find(delver => delver.id === interaction.user.id);
			const [equipmentName, index, value] = interaction.values[0].split(SAFE_DELIMITER);
			user.equipment[index].uses += Number(value);
			interaction.channel.messages.fetch(adventure.messageIds.room).then(roomMessage => {
				const { embeds, remainingActions } = consumeRoomActions(adventure, roomMessage.embeds, 1);
				let components = roomMessage.components;
				if (remainingActions < 1) {
					components = editButtons(components, {
						"upgrade": { preventUse: true, label: "Forge supplies exhausted", emoji: "✔️" },
						"viewrepairs": { preventUse: true, label: "Forge supplies exhausted", emoji: "✔️" }
					})
				}
				return roomMessage.edit({ embeds, components });
			}).then(() => {
				interaction.update({ components: [] });
				interaction.channel.send({ content: `${interaction.user} repaired ${value} uses on their ${equipmentName}.` });
				setAdventure(adventure);
			})
		} else {
			interaction.reply({ content: "The forge's supplies have been exhausted.", ephemeral: true });
		}
	});
