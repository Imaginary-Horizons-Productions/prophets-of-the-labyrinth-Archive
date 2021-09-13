const Button = require('../../Classes/Button.js');
const { dealDamage } = require('../../helpers.js');
const { getAdventure, nextRoom } = require('../adventureList.js');

var button = new Button("getgoldonfire");

button.execute = (interaction, args) => {
    // Gold +20, HP -10
    let adventure = getAdventure(interaction.channel.id);
    adventure.gold += 20;
    interaction.reply(`${interaction.user} reaches into the flames and grabs some coin.`);
    let messagePayload = dealDamage(adventure.delvers.find(delver => delver.id == interaction.user.id), interaction.channel, 10);
    if (messagePayload) {
        interaction.message.edit({ components: [] })
            .catch(console.error);
        interaction.channel.send(messagePayload);
    }
}

module.exports = button;
