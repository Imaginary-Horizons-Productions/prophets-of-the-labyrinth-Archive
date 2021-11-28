const { MessageActionRow, MessageButton } = require("discord.js");
const RoomTemplate = require("../../Classes/RoomTemplate.js")

module.exports = new RoomTemplate()
	.setTypes("event")
	.setTitle("The Score Beggar")
	.setDescription("In the center of the room sits a desolate beggar.\n\"Score... more score... I need it! I'll give you this.\"\nThe beggar motions to a flask of questionable liquid.");

module.exports.components.push(new MessageActionRow().addComponents(
	new MessageButton().setCustomId("buylife")
		.setLabel("Take the flask [-50 score, +1 life]")
		.setStyle("SUCCESS"),
	new MessageButton().setCustomId("continue")
		.setLabel("Move on")
		.setStyle("SECONDARY")
))
