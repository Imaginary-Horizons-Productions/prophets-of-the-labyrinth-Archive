const { MessageActionRow, MessageButton } = require("discord.js");
const Room = require("../../Classes/Room.js")

var room = new Room("event ", "Free Gold?", "A large pile of gold sits quietly in the middle of the room, seemingly alone.");

room.components.push(new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId("freegold")
            .setLabel("Would be a waste to leave it there [+30 gold]")
            .setStyle("SUCCESS")
    ))

module.exports = room;
