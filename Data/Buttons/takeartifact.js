const Button = require('../../Classes/Button.js');
const { setAdventure, getAdventure, updateRoomHeader } = require('../adventureDAO.js');
const { editButton } = require('../roomDAO.js');

module.exports = new Button("takeartifact");

module.exports.execute = (interaction, [artifactName]) => {
	// Move the artifact from loot into party inventory
	let adventure = getAdventure(interaction.channel.id);
	let lootIndex = `artifact-${artifactName}`;
	adventure.artifacts[artifactName] = adventure.room.loot[lootIndex];
	let updatedUI = editButton(interaction.message, `take${lootIndex}`, true, "✔️", `${artifactName} GET`)
	interaction.update({ components: updatedUI }).then(() => {
		updateRoomHeader(adventure, interaction.message);
		delete adventure.room.loot[lootIndex];
		setAdventure(adventure);
	});
}
