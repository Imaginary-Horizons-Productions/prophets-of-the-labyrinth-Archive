const { MessageActionRow, MessageButton } = require("discord.js");
const ResourceTemplate = require("../../Classes/ResourceTemplate.js");
const RoomTemplate = require("../../Classes/RoomTemplate.js")

module.exports = new RoomTemplate("Free Gold?")
	.setDescription("A large pile of gold sits quietly in the middle of the room, seemingly alone.")
	.setElement("Fire");

module.exports.uiRows.push(new MessageActionRow().addComponents(
	new MessageButton()
		.setCustomId("getgoldonfire")
		.setLabel("Would be a waste to leave it there [+50 gold]")
		.setStyle("DANGER")
))

module.exports.resourceList = { "gold": "50" };
