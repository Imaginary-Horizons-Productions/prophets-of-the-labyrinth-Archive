const Button = require('../../Classes/Button.js');
const { getAdventure, nextRoom } = require('../adventureDAO.js');
const { gainHealth, takeDamage } = require("../combatantDAO.js");

module.exports = new Button("hpshare");

module.exports.execute = (interaction, args) => {
	// Take hp from user, give to party members
	let adventure = getAdventure(interaction.channel.id);
	adventure.delvers.forEach(delver => {
		if (delver.id !== interaction.user.id) {
			gainHealth(delver, 5, adventure.battleEnemyTitles);
		}
	})
	let damageText = takeDamage(adventure.delvers.find(delver => delver.id == interaction.user.id), 10, "untyped", adventure);
	interaction.reply(`${damageText} Everyone else gains 5 hp.`);
	if (adventure.lives > 0) {
		nextRoom(adventure, interaction.channel);
	}
	interaction.message.edit({ components: [] })
		.catch(console.error);
}
