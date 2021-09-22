const Button = require('../../Classes/Button.js');
const { gainHealth } = require('../../helpers.js');
const { nextRoom } = require('../adventureList.js');

module.exports = new Button("hpshare");

module.exports.execute = (interaction, args) => {
    // Take hp from user, give to party members
    let adventure = getAdventure(interaction.channel.id);
    adventure.delvers.forEach(delver => {
        if (delver.id !== interaction.user.id) {
            gainHealth(delver, 5);
        }
    })
    interaction.reply(`${interaction.user} loses 10 hp. Everyone else gains 5 hp.`);
    interaction.message.edit({ components: [] })
        .catch(console.error);
    let messagePayload = adventure.delvers.find(delver => delver.id == interaction.user.id).takeDamage(interaction.channel, 10);
    if (messagePayload) {
        interaction.channel.send(messagePayload);
    } else {
        interaction.followUp(nextRoom(adventure, interaction.channel));
    }
}
