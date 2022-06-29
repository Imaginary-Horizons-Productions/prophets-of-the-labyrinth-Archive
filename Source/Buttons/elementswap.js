const Button = require('../../Classes/Button.js');
const { getAdventure, setAdventure } = require('../adventureDAO.js');

const id = "elementswap";
module.exports = new Button(id, (interaction, args) => {
	// Switch the adventurer's element to the given element
	let adventure = getAdventure(interaction.channel.id);
	let delver = adventure.delvers.find(delver => delver.id == interaction.user.id);
	if (delver) {
		if (adventure.gold >= 100) {
			adventure.gold -= 100;
			delver.element = adventure.room.element;
			interaction.reply(`${interaction.user} signs the contract and becomes ${adventure.room.element} element.`).then(() => {
				setAdventure(adventure);
			});
		} else {
			interaction.reply({ content: "You can't afford this contract.", ephemeral: true });
		}
	} else {
		interaction.reply({ content: "Please swap elements in adventures you've joined.", ephemeral: true });
	}
});
