const { MessageActionRow, MessageButton } = require("discord.js");
const RoomTemplate = require("../../Classes/RoomTemplate.js")

module.exports = new RoomTemplate()
	.setTypes("Event")
	.setTitle("Gold on Fire")
	.setDescription("In the center of the room, there is a huge fire. In the center of the fire, there is a pile of gold.")
	.setElement("Fire");

module.exports.uiRows.push(new MessageActionRow().addComponents(
	new MessageButton()
		.setCustomId("getgoldonfire")
		.setLabel("Grab some gold [+50 gold, -100 hp]")
		.setStyle("DANGER")
));
