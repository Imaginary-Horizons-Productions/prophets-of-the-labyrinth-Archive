const Button = require('../../Classes/Button.js');
const { setAdventure, getAdventure } = require('../adventureDAO.js');

module.exports = new Button("take");

module.exports.execute = (interaction, args) => {
	// Move the gold and relics from loot into party inventory
	let adventure = getAdventure(interaction.channel.id);
	adventure.gold += adventure.room.loot.Gold;
	setAdventure(adventure);
	let takeRemoved = interaction.message.components.map(row => {
		row.components = row.components.filter(components => components.customId !== "take");
		if (row.components.length) {
			return row;
		} else {
			return null;
		}
	}).filter(row => row !== null);
	interaction.update({
		components: takeRemoved
	});
	interaction.followUp({ content: `The party is ${adventure.room.loot.Gold} gold richer (total: ${adventure.gold}).` });
}
