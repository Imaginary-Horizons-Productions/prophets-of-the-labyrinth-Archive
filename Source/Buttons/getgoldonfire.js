const Button = require('../../Classes/Button.js');
const { generateRandomNumber } = require('../../helpers.js');
const { getAdventure, completeAdventure, updateRoomHeader, setAdventure } = require('../adventureDAO.js');
const { dealDamage } = require("../combatantDAO.js");
const { editButtons } = require('../roomDAO.js');

module.exports = new Button("getgoldonfire");

module.exports.execute = (interaction, args) => {
	// Gold +50, HP -100
	let adventure = getAdventure(interaction.channel.id);
	let delver = adventure.delvers.find(delver => delver.id == interaction.user.id);
	let goldCount = adventure.room.resources.gold.count;
	const damageChance = 50;
	if (delver) {
		adventure.gainGold(goldCount);
		if (generateRandomNumber(adventure, 101, "general") > damageChance) { // deal damage on chance 50%
			dealDamage(delver, null, 100, true, "Untyped", adventure).then(damageText => {
				updateRoomHeader(adventure, interaction.message);
				if (adventure.lives < 1) {
					interaction.reply({ embeds: [completeAdventure(adventure, interaction.channel, { isSuccess: false, description: null })] });
				} else {
					interaction.update({ components: editButtons(interaction.message.components, { "getgoldonfire": { preventUse: true, label: `+${goldCount} gold`, emoji: "✔️" } }) })
					interaction.channel.send(`${interaction.user} reaches in to grab some coin. Oh no! The gold burst into flames ${damageText}`);
					setAdventure(adventure);
				}
			});
		} else { // just take the gold
			interaction.update({ components: editButtons(interaction.message.components, { "getgoldonfire": { preventUse: true, label: `+${goldCount} gold`, emoji: "✔️" } }) })
			setAdventure(adventure);
		}

	} else {
		interaction.reply({ content: "Please burn yourself on gold in adventures you've joined.", ephemeral: true });
	}
}
