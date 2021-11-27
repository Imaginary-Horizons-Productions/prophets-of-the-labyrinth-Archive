const { MessageActionRow, MessageButton } = require("discord.js");
const RoomTemplate = require("../../Classes/RoomTemplate.js")

module.exports = new RoomTemplate()
	.setTypes("event")
	.setTitle("Free Gold?")
	.setDescription("A large pile of gold sits quietly in the middle of the room, seemingly alone.");

module.exports.components.push(new MessageActionRow().addComponents(
	new MessageButton().setCustomId("takegold")
		.setLabel("Would be a waste to leave it there [+30 gold]")
		.setStyle("SUCCESS"),
	new MessageButton().setCustomId("continue")
		.setLabel("Move on")
		.setStyle("SECONDARY")
))

module.exports.lootList = { "gold": "30" };
