const { MessageActionRow, MessageButton } = require("discord.js");
const RoomTemplate = require("../../Classes/RoomTemplate.js")

module.exports = new RoomTemplate()
	.setTypes("Event")
	.setTitle("Health Redistrabution")
	.setDescription("An imp wearing glasses approaches you with a contract. It would allow you to heal your party members at the expense of the life of one of your own.")
	.setElement("Water");

module.exports.uiRows.push(new MessageActionRow()
	.addComponents(
		new MessageButton()
			.setCustomId("hpshare")
			.setLabel("Redistribute Health [-10 hp, +5 hp for everyone else]")
			.setStyle("DANGER")
	))
