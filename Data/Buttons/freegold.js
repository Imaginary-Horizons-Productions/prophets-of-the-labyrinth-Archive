const Button = require('../../Classes/Button.js');
const { nextRoom, setAdventure, getAdventure } = require('../adventureDAO.js');

module.exports = new Button("freegold");

module.exports.execute = (interaction, args) => {
	// +20 gold
	let adventure = getAdventure(interaction.channel.id);
	adventure.gold += 20;
	setAdventure(adventure);
	interaction.reply({ content: `The party is 20 gold richer.`});
	nextRoom(adventure, interaction.channel);
}
