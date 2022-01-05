const { MessageActionRow, MessageButton } = require("discord.js");
const RoomTemplate = require("../../Classes/RoomTemplate.js")

module.exports = new RoomTemplate()
	.setTypes("Event", "Rest Site")
	.setTitle("Rest Site")
	.setDescription("The room contains a rest site... and a mysterious challenger hanging out in the corner.")
	.setElement("@{adventure}");

module.exports.uiRows.push(new MessageActionRow().addComponents(
	new MessageButton().setCustomId("rest")
		.setLabel("Rest [15% hp]")
		.setStyle("PRIMARY"),
	new MessageButton().setCustomId("challenge")
		.setLabel("Take a challenge (coming soon)")
		.setStyle("DANGER")
		.setDisabled(true)
))
