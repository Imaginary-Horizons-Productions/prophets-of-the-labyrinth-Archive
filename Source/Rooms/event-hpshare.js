const { MessageActionRow, MessageButton } = require("discord.js");
const RoomTemplate = require("../../Classes/RoomTemplate.js")

module.exports = new RoomTemplate("Health Redistrabution", [
]).setDescription("An imp wearing glasses approaches you with a contract. It would allow you to heal your party members at the expense of the life of one of your own.")
	.setElement("Water");

module.exports.uiRows.push(new MessageActionRow().addComponents(
	new MessageButton()
		.setCustomId("hpshare")
		.setLabel("Sign the contract [-50g, -50 hp, +50 hp for everyone else]")
		.setStyle("PRIMARY")
))
