const { nextRoom, getAdventure } = require('../adventureDictionary.js');
const Button = require('../Classes/Button.js');

var button = new Button("continue");

button.execute = (interaction, args) => {
    // Generate the next room of an adventure
    let adventure = getAdventure(interaction.channel.id);
    interaction.message.edit({ components: [] })
        .catch(console.error);
    interaction.reply(nextRoom(adventure, interaction.channel));
}

module.exports = button;
