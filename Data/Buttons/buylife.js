const Button = require('../../Classes/Button.js');
const { saveAdventures, getAdventure, updateRoomHeader } = require('../adventureDAO.js');
const { editButton } = require('../roomDAO.js');

module.exports = new Button("buylife");

module.exports.execute = (interaction, args) => {
	// -50 score, +1 life
	let adventure = getAdventure(interaction.channel.id);
	if (adventure.delvers.map(delver => delver.id).includes(interaction.user.id)) {
		adventure.lives++;
		adventure.accumulatedScore -= 50;
		updateRoomHeader(adventure, interaction.message);
		let updatedUI = editButton(interaction.message, "buylife", true, "✔️", "-50 score, +1 life");
		interaction.update({ components: updatedUI }).then(() => {
			saveAdventures();
		});
	} else {
		interaction.reply({ content: "Please buy lives in adventures you've joined.", ephemeral: true });
	}
}
