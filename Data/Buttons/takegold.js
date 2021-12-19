const Button = require('../../Classes/Button.js');
const { setAdventure, getAdventure, updateRoomHeader } = require('../adventureDAO.js');
const { editButton } = require('../roomDAO.js');

module.exports = new Button("takegold");

module.exports.execute = (interaction, args) => {
	// Move the gold and relics from loot into party inventory
	let adventure = getAdventure(interaction.channel.id);
	adventure.gainGold(adventure.room.loot.gold);
	let updatedUI = editButton(interaction.message, "takegold", true, "✔️", `+${adventure.room.loot.gold} gold`)
	interaction.update({ components: updatedUI }).then(() => {
		updateRoomHeader(adventure, interaction.message);
		adventure.room.loot.gold = 0;
		setAdventure(adventure);
	});
}
