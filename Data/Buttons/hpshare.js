const Button = require('../../Classes/Button.js');
const { healDamage } = require('../../helpers.js');
const { nextRoom } = require('../adventureList.js');

var button = new Button("hpshare");

button.execute = (interaction, args) => {
    // Take hp from user, give to party members
    let adventure = getAdventure(interaction.channel.id);
    adventure.delvers.forEach(delver => {
        if (delver.id !== interaction.user.id) {
            healDamage(delver, 5);
        }
    })
    interaction.reply(`${interaction.user} loses 10 hp. Everyone else gains 5 hp.`);
    interaction.message.edit({ components: [] })
        .catch(console.error);
    let messagePayload = dealDamage(adventure.delvers.find(delver => delver.id == interaction.user.id), interaction.channel, 10);
    if (messagePayload) {
        interaction.channel.send(messagePayload);
    } else {
        interaction.followUp(nextRoom(adventure, interaction.channel));
    }
}

module.exports = button;
