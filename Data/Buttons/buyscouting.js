const Button = require('../../Classes/Button.js');
const { getAdventure, setAdventure, updateRoomHeader } = require('../adventureDAO.js');
const { editButton } = require("../roomDAO.js");

module.exports = new Button("buyscouting");

module.exports.execute = (interaction, [type, cost]) => {
	// Set flags for party scouting and remove gold from party inventory
	let adventure = getAdventure(interaction.channel.id);
	let user = adventure.delvers.find(delver => delver.id == interaction.user.id);
	if (user) {
		if (type === "finalboss") {
			adventure.scouting.finalBoss = true;
			interaction.update({ components: editButton(interaction.message, `buyscouting-finalboss-${cost}`, true, "✔️", `Final Boss: ${adventure.finalBoss}`) });
			interaction.followUp(`The merchant reveals that final boss for this adventure will be **${adventure.finalBoss}** (you can review this in Party Stats).`);
		} else {
			//TODO #138 if out of prerolled artifact guardians, roll a new one
			interaction.reply(`The merchant reveals that the next artifact guardian for this adventure will be **${adventure.artifactGuardians[adventure.scouting.artifactGuardians]}** (you can review this in Party Stats).`);
			adventure.scouting.artifactGuardians++;
		}
		adventure.gold -= cost;
		updateRoomHeader(adventure, interaction.message);
		setAdventure(adventure);
	} else {
		interaction.reply({ content: "Plesae buy scouting in adventures you've joined.", ephemeral: true });
	}
}
