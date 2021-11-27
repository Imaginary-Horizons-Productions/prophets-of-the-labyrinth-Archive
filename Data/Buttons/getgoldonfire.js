const { MessageEmbed } = require('discord.js');
const Button = require('../../Classes/Button.js');
const { getAdventure, completeAdventure, saveAdventures } = require('../adventureDAO.js');
const { dealDamage } = require("../combatantDAO.js");

module.exports = new Button("getgoldonfire");

module.exports.execute = (interaction, args) => {
	// Gold +50, HP -100
	let adventure = getAdventure(interaction.channel.id);
	adventure.gold += 50;
	dealDamage(adventure.delvers.find(delver => delver.id == interaction.user.id), null, 100, "untyped", adventure).then(damageText => {
		interaction.reply(`${interaction.user} reaches into the flames and grabs some coin. ${damageText}`);
		//TODO #102 update room message (gold in particular)
		if (adventure.lives < 1) {
			completeAdventure(adventure, interaction.channel, new MessageEmbed().setTitle("Defeat"));
		} else {
			saveAdventures();
		}
	});
}
