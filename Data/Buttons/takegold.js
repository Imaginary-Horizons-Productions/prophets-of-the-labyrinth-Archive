const Button = require('../../Classes/Button.js');
const { editButton } = require('../../helpers.js');
const { setAdventure, getAdventure, updateRoomHeader } = require('../adventureDAO.js');

module.exports = new Button("takegold");

module.exports.execute = (interaction, args) => {
	// Move the gold and relics from loot into party inventory
	let adventure = getAdventure(interaction.channel.id);
	adventure.gainGold(adventure.room.loot.gold);
	editButton(interaction, "takegold", true, "✔️", `+${adventure.room.loot.gold} gold`).then(() => {
		updateRoomHeader(adventure, interaction.message);
		adventure.room.loot.gold = 0;
		setAdventure(adventure);
	});
}
