const Button = require('./../Classes/Button.js');
const { getPlayer } = require('../playerDictionary.js');
const { getAdventure, saveAdventure } = require("./../adventureDictionary.js");

var button = new Button("join");

button.execute = (interaction, args) => {
    // Give the basic rules and information about the bot
    interaction.guild.channels.fetch(args[1]).then(channel => {
        var adventure = getAdventure(channel.id);
        if (!adventure.players.some(player => player.id == interaction.user.id)) {
            adventure.players.push(getPlayer(interaction.user.id, interaction.guild.id));
            channel.permissionOverwrites.create(interaction.user, {
                VIEW_CHANNEL: true
            })
            saveAdventure(adventure);
            interaction.reply({ content: `You have joined the adventure! Here's a link to the channel: ${channel}`, ephemeral: true });
            channel.send(`${interaction.member} joined the adventure.`)
                .catch(console.error)
        } else {
            interaction.reply(`You are already part of this adventure! Here's a link: ${channel}`)
                .catch(console.error);
        }
    })
}

module.exports = button;
