const { MessageActionRow, MessageButton } = require("discord.js");
const RoomTemplate = require("../../Classes/RoomTemplate.js")

module.exports = new RoomTemplate()
	.setTypes("Empty")
	.setTitle("Empty Room")
	.setDescription("This room is empty. Lucky you?")
	.setElement("Darkness");

module.exports.uiRows.push(new MessageActionRow().addComponents(
	new MessageButton().setCustomId("continue")
		.setLabel("Move on")
		.setStyle("SECONDARY")
))
