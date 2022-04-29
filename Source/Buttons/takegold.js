const Button = require('../../Classes/Button.js');
const { setAdventure, getAdventure, updateRoomHeader } = require('../adventureDAO.js');
const { editButtons } = require('../roomDAO.js');

module.exports = new Button("takegold");

module.exports.execute = (interaction, args) => {
	// Move the gold and artifacts from loot into party inventory
	let adventure = getAdventure(interaction.channel.id);
	let goldCount = adventure.room.resources.gold.count;
	adventure.gainGold(goldCount);
	interaction.update({ components: editButtons(interaction.message.components, { "takegold": { preventUse: true, label: `+${goldCount} gold`, emoji: "✔️" } }) }).then(() => {
		updateRoomHeader(adventure, interaction.message);
		adventure.room.resources.gold.count = 0;
		setAdventure(adventure);
	});
}
