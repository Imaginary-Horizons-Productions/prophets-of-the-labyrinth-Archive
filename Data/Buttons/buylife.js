const Button = require('../../Classes/Button.js');
const { saveAdventures, getAdventure, nextRoom, updateRoomHeader } = require('../adventureDAO.js');

module.exports = new Button("buylife");

module.exports.execute = (interaction, args) => {
	// -50 score, +1 life
	let adventure = getAdventure(interaction.channel.id);
	adventure.lives++;
	adventure.accumulatedScore -= 50;
	updateRoomHeader(adventure, interaction.message);
	interaction.reply(`The beggar hastily hands over the flask, which tastes awful.`).then(() => {
		nextRoom(adventure, interaction.channel);
		interaction.message.edit({ components: [] })
			.catch(console.error);
		saveAdventures();
	});
}
