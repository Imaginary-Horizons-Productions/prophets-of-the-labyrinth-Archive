const { MessageActionRow, MessageButton } = require("discord.js");
const RoomTemplate = require("../../Classes/RoomTemplate.js")

module.exports = new RoomTemplate()
	.setTypes("Event")
	.setTitle("Free Gold?")
	.setDescription("A large pile of gold sits quietly in the middle of the room, seemingly alone.")
	.setElement("Light");

module.exports.uiRows.push(new MessageActionRow().addComponents(
	new MessageButton().setCustomId("takegold")
		.setLabel("Would be a waste to leave it there [+30 gold]")
		.setStyle("DANGER")
))

module.exports.lootList = { "gold": "30" };
