const Button = require('../../Classes/Button.js');
const { getAdventure, setAdventure, updateRoomHeader } = require('../adventureDAO.js');
const { editButton } = require("../roomDAO.js");
const { prerollBoss } = require('../Rooms/_roomDictionary.js');

module.exports = new Button("buyscouting");

module.exports.execute = (interaction, [type, cost]) => {
	// Set flags for party scouting and remove gold from party inventory
	let adventure = getAdventure(interaction.channel.id);
	let user = adventure.delvers.find(delver => delver.id == interaction.user.id);
	if (user) {
		if (type === "finalbattle") {
			adventure.scouting.finalBoss = true;
			interaction.update({ components: editButton(interaction.message, `buyscouting-finalbattle-${cost}`, true, "✔️", `Final Battle: ${adventure.finalBoss}`) });
			interaction.followUp(`The merchant reveals that final battle for this adventure will be **${adventure.finalBoss}** (you can review this with \`/party-stats\`).`);
		} else {
			interaction.reply(`The merchant reveals that the next artifact guardian for this adventure will be **${adventure.artifactGuardians[adventure.scouting.artifactGuardians]}** (you can review this with \`/party-stats\`).`);
			adventure.scouting.artifactGuardians++;
			while (adventure.artifactGuardians.length <= adventure.scouting.artifactGuardians) {
				prerollBoss("Relic Guardian", adventure);
			}
		}
		adventure.gold -= cost;
		updateRoomHeader(adventure, interaction.message);
		setAdventure(adventure);
	} else {
		interaction.reply({ content: "Plesae buy scouting in adventures you've joined.", ephemeral: true });
	}
}
