const { MessageActionRow, MessageButton } = require("discord.js");
const RoomTemplate = require("../../Classes/RoomTemplate.js")

module.exports = new RoomTemplate("Element Redistrabution")
	.setDescription("An imp wearing glasses approaches you with a contract. It would allow you to change your element to @{roomElement}.")
	.setElement("@{adventureWeakness}");

module.exports.uiRows.push(new MessageActionRow().addComponents(
	new MessageButton().setCustomId("elementswap")
		.setLabel("Sign the contract [-100g, change element]")
		.setStyle("PRIMARY")
))
