const { MessageActionRow, MessageButton } = require("discord.js");
const Room = require("../../Classes/Room.js")

module.exports = new Room()
	.setType("event")
	.setTitle("Free Gold?")
	.setDescription("A large pile of gold sits quietly in the middle of the room, seemingly alone.");

module.exports.components.push(new MessageActionRow()
	.addComponents(
		new MessageButton()
			.setCustomId("freegold")
			.setLabel("Would be a waste to leave it there [+30 gold]")
			.setStyle("SUCCESS")
	))
