const Button = require('../../Classes/Button.js');
const { generateRandomNumber } = require('../../helpers.js');
const { getAdventure, completeAdventure, setAdventure } = require('../adventureDAO.js');
const { payHP } = require("../combatantDAO.js");
const { editButtons } = require('../roomDAO.js');

const customId = "getgoldonfire";
module.exports = new Button(customId,
	/** Gold +50, HP -100 half the time*/
	(interaction, args) => {
		const adventure = getAdventure(interaction.channel.id);
		const delver = adventure?.delvers.find(delver => delver.id == interaction.user.id);
		if (!delver) {
			interaction.reply({ content: "This adventure isn't active or you aren't participating in it.", ephemeral: true });
			return;
		}

		const goldCount = adventure.room.resources.gold.count;
		const damageChance = 50;
		adventure.gainGold(goldCount);
		if (generateRandomNumber(adventure, 101, "general") > damageChance) { // deal damage on chance 50%
			const resultText = `${interaction.user} reaches in to grab some coin. Oh no! The gold burst into flames ${payHP(delver, 100, adventure)}`;
			if (adventure.lives < 1) {
				interaction.update({ components: [] });
				interaction.channel.send(completeAdventure(adventure, interaction.channel, "defeat", resultText));
			} else {
				interaction.update({ components: editButtons(interaction.message.components, { [customId]: { preventUse: true, label: `+${goldCount} gold`, emoji: "✔️" } }) })
				interaction.channel.send(resultText);
				setAdventure(adventure);
			}
		} else { // just take the gold
			interaction.update({ components: editButtons(interaction.message.components, { [customId]: { preventUse: true, label: `+${goldCount} gold`, emoji: "✔️" } }) })
			setAdventure(adventure);
		}
	}
);
