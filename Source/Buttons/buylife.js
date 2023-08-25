const Button = require('../../Classes/Button.js');
const { getAdventure, setAdventure } = require('../adventureDAO.js');
const { editButtons, updateRoomHeader } = require('../roomDAO.js');

const customId = "buylife";
module.exports = new Button(customId,
	/** -50 score, +1 life */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channel.id);
		if (!adventure?.delvers.some(delver => delver.id == interaction.user.id)) {
			interaction.reply({ content: "This adventure isn't active or you aren't participating in it.", ephemeral: true });
			return;
		}

		adventure.lives++;
		adventure.accumulatedScore -= 50;
		updateRoomHeader(adventure, interaction.message);
		const updatedUI = editButtons(interaction.message.components, { [customId]: { preventUse: true, label: "-50 score, +1 life", emoji: "✔️" } });
		interaction.update({ components: updatedUI }).then(() => {
			setAdventure(adventure);
		});
	}
);
