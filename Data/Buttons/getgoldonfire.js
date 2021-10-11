const Button = require('../../Classes/Button.js');
const { getAdventure } = require('../adventureDAO.js');
const { dealDamage } = require("../combatantDAO.js");

module.exports = new Button("getgoldonfire");

module.exports.execute = (interaction, args) => {
	// Gold +20, HP -10
	let adventure = getAdventure(interaction.channel.id);
	adventure.gold += 20;
	let damageText = dealDamage(adventure.delvers.find(delver => delver.id == interaction.user.id), 10, "untyped", adventure);
	interaction.reply(`${interaction.user} reaches into the flames and grabs some coin. ${damageText}`);
}
