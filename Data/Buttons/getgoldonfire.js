const Button = require('../../Classes/Button.js');
const { getAdventure, takeDamage } = require('../adventureList.js');

module.exports = new Button("getgoldonfire");

module.exports.execute = (interaction, args) => {
    // Gold +20, HP -10
    let adventure = getAdventure(interaction.channel.id);
    adventure.gold += 20;
	let damageText = takeDamage(adventure.delvers.find(delver => delver.id == interaction.user.id), interaction.channel, 10);
    interaction.reply(`${interaction.user} reaches into the flames and grabs some coin. ${damageText}`);
}
