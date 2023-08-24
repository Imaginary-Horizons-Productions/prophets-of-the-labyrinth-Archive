const Button = require('../../Classes/Button.js');
const { getAdventure, completeAdventure, setAdventure } = require('../adventureDAO.js');
const { gainHealth, payHP } = require("../combatantDAO.js");
const { editButtons } = require('../roomDAO.js');

const customId = "hpshare";
module.exports = new Button(customId,
	/** Take hp from user, give to party members */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channel.id);
		const delver = adventure?.delvers.find(delver => delver.id == interaction.user.id);
		if (!delver) {
			interaction.reply({ content: "This adventure isn't active or you aren't participating in it.", ephemeral: true });
			return;
		}

		const goldCost = 50;
		if (adventure.gold < goldCost) {
			interaction.reply({ content: "You can't afford this contract.", ephemeral: true });
			return;
		}

		adventure.gold -= goldCost;
		const hpLost = 50;
		const hpGained = 50;
		const resultText = `${payHP(delver, hpLost, adventure)} Everyone else gains ${hpGained} hp.`;
		adventure.delvers.forEach(delver => {
			if (delver.id != interaction.user.id) {
				gainHealth(delver, hpGained, adventure, false);
			}
		})
		if (adventure.lives < 1) {
			interaction.update({ components: [] });
			interaction.channel.send(completeAdventure(adventure, interaction.channel, "defeat", resultText));
		} else {
			interaction.update({ components: editButtons(interaction.message.components, { [customId]: { preventUse: true, label: `${interaction.member.displayName} shared HP.`, emoji: "✔️" } }) });
			interaction.channel.send(resultText);
			setAdventure(adventure);
		}
	}
);
