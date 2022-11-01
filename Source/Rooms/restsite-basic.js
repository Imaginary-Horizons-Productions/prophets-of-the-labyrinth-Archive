const { MessageActionRow, MessageButton } = require("discord.js");
const ResourceTemplate = require("../../Classes/ResourceTemplate.js");
const RoomTemplate = require("../../Classes/RoomTemplate.js")

module.exports = new RoomTemplate("Rest Site", [
	new ResourceTemplate("roomAction", "n", "internal"),
	new ResourceTemplate("challenge", "2", "internal")
]).setDescription("The room contains a rest site... and a mysterious challenger hanging out in the corner.")
	.setElement("@{adventure}");

module.exports.uiRows.push(new MessageActionRow().addComponents(
	new MessageButton().setCustomId("rest")
		.setLabel("Rest [30% hp]")
		.setEmoji("1️⃣")
		.setStyle("PRIMARY"),
	new MessageButton().setCustomId("viewchallenges")
		.setLabel("Take a challenge")
		.setEmoji("1️⃣")
		.setStyle("DANGER")
))
