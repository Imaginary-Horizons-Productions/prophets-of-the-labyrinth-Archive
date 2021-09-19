const { MessageActionRow, MessageButton } = require("discord.js");
const Room = require("../../Classes/Room.js")

module.exports = new Room("event", "Gold on Fire", "In the center of the room, there is a huge fire. In the center of the fire, there is a pile of gold.");

module.exports.components.push(new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId("getgoldonfire")
            .setLabel("Grab some gold [+20 gold, -10 hp]")
            .setStyle("DANGER"),
        new MessageButton()
            .setCustomId("continue")
            .setLabel("Move on")
            .setStyle("SECONDARY")
    ));
