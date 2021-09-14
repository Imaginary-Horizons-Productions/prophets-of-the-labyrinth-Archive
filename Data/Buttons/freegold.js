const Button = require('../../Classes/Button.js');
const { nextRoom, setAdventure } = require('../adventureList.js');
const { getAdventure } = require('../adventureList.js');

var button = new Button("freegold");

button.execute = (interaction, args) => {
    // +20 gold
    let adventure = getAdventure(interaction.channel.id);
    adventure.gold += 20;
    setAdventure(adventure);
    interaction.reply(nextRoom(adventure, interaction.channel));
}

module.exports = button;
