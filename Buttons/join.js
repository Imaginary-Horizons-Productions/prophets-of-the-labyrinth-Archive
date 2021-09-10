const Button = require('./../Classes/Button.js');
const { getPlayer } = require('../playerDictionary.js');
const { getAdventure } = require("./../adventureDictionary.js");

var button = new Button("join");

button.execute = (interaction) => {
    // Give the basic rules and information about the bot
    var adventure = getAdventure(interaction.user.id); //TODO swap placeholder user id for channel id
    adventure.players.push(getPlayer(interaction.user.id));
    //TODO save adventure
    interaction.reply(`${interaction.member} joined the adventure.`)
        .catch(console.error)
}

module.exports = button;
