const { MessageActionRow, MessageButton } = require("discord.js");
const RoomTemplate = require("../../Classes/RoomTemplate.js")

module.exports = new RoomTemplate()
	.setTypes("Event", "Forge")
	.setTitle("Abandoned Forge")
	.setDescription("The room contains an abandoned forge. There seem to be enough supplies leftover for everyone to do something.")
	.setElement("@{adventure}");

module.exports.uiRows.push(new MessageActionRow().addComponents(
	new MessageButton().setCustomId("upgrade")
		.setLabel("Consider equipment upgrades")
		.setEmoji("1️⃣")
		.setStyle("SUCCESS"),
	new MessageButton().setCustomId("viewrepairs")
		.setLabel("Plan equipment repairs")
		.setEmoji("1️⃣")
		.setStyle("PRIMARY")
))

module.exports.resourceList = { "roomActions": "n" };
