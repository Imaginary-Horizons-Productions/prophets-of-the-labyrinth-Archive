const Button = require('../../Classes/Button.js');
const { getAdventure, completeAdventure, setAdventure } = require('../adventureDAO.js');
const { gainHealth, payHP } = require("../combatantDAO.js");
const { editButtons } = require('../roomDAO.js');

const id = "hpshare";
module.exports = new Button(id, (interaction, args) => {
	// Take hp from user, give to party members
	const adventure = getAdventure(interaction.channel.id);
	const delver = adventure.delvers.find(delver => delver.id == interaction.user.id);
	if (adventure.gold >= 50) {
		adventure.gold -= 50;
		const resultText = `${payHP(delver, 50, adventure)} Everyone else gains 50 hp.`;
		adventure.delvers.forEach(delver => {
			if (delver.id !== interaction.user.id) {
				gainHealth(delver, 50, adventure, false);
			}
		})
		if (adventure.lives < 1) {
			interaction.update({ components: [] });
			interaction.channel.send(completeAdventure(adventure, interaction.channel, "defeat", resultText));
		} else {
			interaction.update({ components: editButtons(interaction.message.components, { [id]: { preventUse: true, label: `${interaction.member.displayName} shared HP.`, emoji: "✔️" } }) });
			interaction.channel.send(resultText);
			setAdventure(adventure);
		}
	} else {
		interaction.reply({ content: "You can't afford this contract.", ephemeral: true });
	}
});
