const Button = require('../../Classes/Button.js');
const { getAdventure, setAdventure } = require('../adventureDAO.js');

const customId = "elementswap";
module.exports = new Button(customId, (interaction, args) => {
	// Switch the adventurer's element to the given element
	const adventure = getAdventure(interaction.channel.id);
	const delver = adventure.delvers.find(delver => delver.id == interaction.user.id);
	if (delver.element == adventure.room.element) {
		interaction.reply({ content: `You are already ${adventure.room.element}.`, ephemeral: true });
		return;
	}

	adventure.gainGold(200);
	delver.element = adventure.room.element;
	interaction.reply(`${interaction.user} signs the contract and becomes ${adventure.room.element} element.`).then(() => {
		setAdventure(adventure);
	});
});
