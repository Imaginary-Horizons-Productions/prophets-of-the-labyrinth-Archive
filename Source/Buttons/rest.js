const Button = require('../../Classes/Button.js');
const { setAdventure, getAdventure } = require('../adventureDAO.js');
const { gainHealth } = require('../combatantDAO.js');
const { editButtons } = require('../roomDAO.js');

const id = "rest";
module.exports = new Button(id, (interaction, args) => {
	// Restore 15% max hp each member of the party
	let adventure = getAdventure(interaction.channel.id);
	if (adventure.delvers.map(delver => delver.id).includes(interaction.user.id)) {
		let healText = [];
		for (let delver of adventure.delvers) {
			healText.push(gainHealth(delver, delver.maxHp * 0.30 * (1 - adventure.getChallengeIntensity("Restless")), adventure, 0));
		}
		let updatedUI = editButtons(interaction.message.components, {
			[id]: { preventUse: true, label: "The party rested", emoji: "✔️" },
			"viewchallenges": { preventUse: true, label: "The challenger is gone", emoji: "✖️" }
		});
		interaction.update({ components: updatedUI }).then(() => {
			interaction.followUp(healText.join(" "));
			setAdventure(adventure);
		});
	} else {
		interaction.reply({ content: "Please rest at rest sites in adventures you've joined.", ephemeral: true });
	}
});
