const Button = require('../../Classes/Button.js');
const { setAdventure, getAdventure } = require('../adventureDAO.js');
const { gainHealth } = require('../combatantDAO.js');
const { editButton } = require('../roomDAO.js');

module.exports = new Button("rest");

module.exports.execute = (interaction, args) => {
	// Restore 15% max hp each member of the party
	let adventure = getAdventure(interaction.channel.id);
	if (adventure.delvers.map(delver => delver.id).includes(interaction.user.id)) {
		let healText = [];
		for (let delver of adventure.delvers) {
			healText.push(gainHealth(delver, (delver.maxHp * 0.30) * (1 - (adventure.challenges["Restless"]?.intensity || 0)), adventure, 0));
		}
		let updatedUI = editButton(interaction.message, "rest", true, "✔️", "The party rested")
		interaction.update({ components: updatedUI }).then(() => {
			interaction.followUp(healText.join(" "));
			setAdventure(adventure);
		});
	} else {
		interaction.reply({ content: "Please buy lives in adventures you've joined.", ephemeral: true });
	}
}
