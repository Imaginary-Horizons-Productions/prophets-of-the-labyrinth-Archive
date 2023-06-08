const Button = require('../../Classes/Button.js');
const { getAdventure, setAdventure } = require('../adventureDAO.js');
const { editButtons, updateRoomHeader } = require('../roomDAO.js');

const id = "buylife";
module.exports = new Button(id, (interaction, args) => {
	// -50 score, +1 life
	const adventure = getAdventure(interaction.channel.id);
	adventure.lives++;
	adventure.accumulatedScore -= 50;
	updateRoomHeader(adventure, interaction.message);
	const updatedUI = editButtons(interaction.message.components, { [id]: { preventUse: true, label: "-50 score, +1 life", emoji: "✔️" } });
	interaction.update({ components: updatedUI }).then(() => {
		setAdventure(adventure);
	});
});
