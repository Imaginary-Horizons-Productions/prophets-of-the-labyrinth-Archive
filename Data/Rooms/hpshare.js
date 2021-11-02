const { MessageActionRow, MessageButton } = require("discord.js");
const Room = require("../../Classes/Room.js")

module.exports = new Room()
	.setType("event")
	.setTitle("Health Redistrabution")
	.setDescription("description");

module.exports.components.push(new MessageActionRow()
	.addComponents(
		new MessageButton()
			.setCustomId("hpshare")
			.setLabel("Redistribute Health [-10 hp, +5 hp for everyone else]")
			.setStyle("DANGER"),
		new MessageButton()
			.setCustomId("continue")
			.setLabel("Move on")
			.setStyle("SECONDARY")
	))
