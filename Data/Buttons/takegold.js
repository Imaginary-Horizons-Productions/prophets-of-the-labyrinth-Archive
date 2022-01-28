const Button = require('../../Classes/Button.js');
const { setAdventure, getAdventure, updateRoomHeader } = require('../adventureDAO.js');
const { editButton } = require('../roomDAO.js');

module.exports = new Button("takegold");

module.exports.execute = (interaction, args) => {
	// Move the gold and artifacts from loot into party inventory
	let adventure = getAdventure(interaction.channel.id);
	let goldCount = adventure.room.resources.gold.count;
	adventure.gainGold(goldCount);
	let updatedUI = editButton(interaction.message, "takegold", true, "✔️", `+${goldCount} gold`)
	interaction.update({ components: updatedUI }).then(() => {
		updateRoomHeader(adventure, interaction.message);
		adventure.room.resources.gold.count = 0;
		setAdventure(adventure);
	});
}
