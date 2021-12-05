const Button = require('../../Classes/Button.js');
const { editButton } = require('../../helpers.js');
const { saveAdventures, getAdventure, updateRoomHeader } = require('../adventureDAO.js');

module.exports = new Button("buylife");

module.exports.execute = (interaction, args) => {
	// -50 score, +1 life
	let adventure = getAdventure(interaction.channel.id);
	if (adventure.delvers.map(delver => delver.id).includes(interaction.user.id)) {
		adventure.lives++;
		adventure.accumulatedScore -= 50;
		updateRoomHeader(adventure, interaction.message);
		editButton(interaction, "buylife", true, "✔️", "-50 score, +1 life").then(() => {
			saveAdventures();
		});
	} else {
		interaction.reply({ content: "Please buy lives in adventures you've joined.", ephemeral: true });
	}
}
