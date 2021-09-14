const { MessageActionRow, MessageButton } = require("discord.js");
const Room = require("../../Classes/Room.js")

var room = new Room("event", "Health Redistrabution", "description");

room.components.push(new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId("hpshare")
            .setLabel("Redistribute Health [-10 hp, +5 hp for everyone else]")
            .setStyle("DANGER"),
        new MessageButton()
            .setCustomId("continue")
            .setLabel("Move on")
            .setStyle("SECONDARY")
    ))

module.exports = room;
