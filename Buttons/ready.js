const { getAdventure, completeAdventure } = require('../adventureDictionary.js');
const Button = require('../Classes/Button.js');

var button = new Button("ready");

button.execute = (interaction, args) => {
	// Start an adventure if clicked by adventure leader
	if (interaction.user.id === args[2]) {
		let adventure = getAdventure(args[1]);
		interaction.reply("The adventure has begun!");

		//TODO generate rooms
		adventure.accumulatedScore = 10;
		completeAdventure(adventure, interaction.channel, "success");
	}
}

module.exports = button;
