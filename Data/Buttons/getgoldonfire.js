const Button = require('../../Classes/Button.js');
const { getAdventure, nextRoom } = require('../adventureList.js');

var button = new Button("getgoldonfire");

button.execute = (interaction, args) => {
    // Gold +20, HP -10
    let adventure = getAdventure(interaction.channel.id);
    adventure.delvers.forEach(delver => {
        if (delver.id == interaction.user.id) {
            delver.hp -= 10;
        }
    })
    adventure.gold += 20;
    interaction.message.edit({ components: [] })
        .catch(console.error);
    interaction.reply(nextRoom(adventure, interaction.channel));
}

module.exports = button;
