const Button = require('./../Classes/Button.js');
const { getAdventure, setAdventure } = require("./../adventureDictionary.js");
const Delver = require('../Classes/Delver.js');

var button = new Button("join");

button.execute = (interaction, args) => {
    // Give the basic rules and information about the bot
    interaction.guild.channels.fetch(args[1]).then(channel => {
        var adventure = getAdventure(channel.id);
        if (!adventure.delvers.some(delver => delver.id == interaction.user.id)) {
            adventure.delvers.push(new Delver(interaction.user.id, channel.id));
            channel.permissionOverwrites.create(interaction.user, {
                VIEW_CHANNEL: true
            })
            setAdventure(adventure);
            interaction.reply({ content: `You have joined the adventure! Here's a link to the channel: ${channel}`, ephemeral: true });
            channel.send(`${interaction.member} joined the adventure.`)
                .catch(console.error)
        } else {
            interaction.reply({ content: `You are already part of this adventure! Here's a link: ${channel}`, ephemeral: true })
                .catch(console.error);
        }
    })
}

module.exports = button;
