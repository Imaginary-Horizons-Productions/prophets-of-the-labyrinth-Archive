const Button = require('../../Classes/Button.js');
const { editButton } = require('../../helpers.js');
const { setAdventure, getAdventure } = require('../adventureDAO.js');
const { gainHealth } = require('../combatantDAO.js');

module.exports = new Button("rest");

module.exports.execute = (interaction, args) => {
	// Restore 15% max hp each member of the party
	let adventure = getAdventure(interaction.channel.id);
	if (adventure.delvers.map(delver => delver.id).includes(interaction.user.id)) {
		let healText = [];
		for (let delver of adventure.delvers) {
			healText.push(gainHealth(delver, delver.maxHp * 0.15, adventure.room.enemyTitles));
		}
		editButton(interaction, "rest", true, "✔️", "The party rested").then(() => {
			interaction.followUp(healText.join(" "));
			setAdventure(adventure);
		});
	} else {
		interaction.reply({ content: "Please buy lives in adventures you've joined.", ephemeral: true });
	}
}
