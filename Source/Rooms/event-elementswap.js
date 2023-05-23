const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const RoomTemplate = require("../../Classes/RoomTemplate.js")

module.exports = new RoomTemplate("Element Redistribution", [
]).setDescription("An imp wearing glasses approaches you with a contract. It would allow you to change your element to @{roomElement}.")
	.setElement("@{adventureWeakness}");

module.exports.uiRows.push(new ActionRowBuilder().addComponents(
	new ButtonBuilder().setCustomId("elementswap")
		.setLabel("Sign the contract [-100g, change element]")
		.setStyle(ButtonStyle.Primary)
))
