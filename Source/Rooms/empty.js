const { MessageActionRow, MessageButton } = require("discord.js");
const RoomTemplate = require("../../Classes/RoomTemplate.js")

module.exports = new RoomTemplate("Empty Room", [
]).setDescription("This room is empty. Lucky you?")
	.setElement("Untyped");

module.exports.uiRows.push(new MessageActionRow().addComponents(
	new MessageButton().setCustomId("continue")
		.setEmoji("👑")
		.setLabel("Move on")
		.setStyle("SECONDARY")
))
