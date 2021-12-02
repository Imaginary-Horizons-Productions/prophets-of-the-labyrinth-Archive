const { MessageActionRow, MessageButton } = require("discord.js");
const RoomTemplate = require("../../Classes/RoomTemplate.js")

module.exports = new RoomTemplate()
	.setTypes("event", "forge")
	.setTitle("Abandoned Forge")
	.setDescription("The room contains an abandoned forge. There seem to be enough supplies leftover for everyone to do something.")
	.setElement("@{adventure}");

module.exports.components.push(new MessageActionRow().addComponents(
	new MessageButton().setCustomId("upgrade")
		.setLabel("Pick a weapon to randomly upgrade")
		.setStyle("SUCCESS"),
	new MessageButton().setCustomId("repair")
		.setLabel("Repair a weapon")
		.setStyle("PRIMARY"),
	new MessageButton().setCustomId("continue")
		.setLabel("Move on")
		.setStyle("SECONDARY")
))

module.exports.lootList = { "forgeSupplies": "n" };
