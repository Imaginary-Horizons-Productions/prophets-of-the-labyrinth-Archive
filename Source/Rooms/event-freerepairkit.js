const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const ResourceTemplate = require("../../Classes/ResourceTemplate.js");
const RoomTemplate = require("../../Classes/RoomTemplate.js")

module.exports = new RoomTemplate("Repair Kit, just hanging out", [
	new ResourceTemplate("Repair Kit", "1", "internal")
]).setDescription("There's a Repair Kit hanging in the middle of the room tied to the ceiling by a rope.")
	.setElement("Earth");

module.exports.buildUI = function (adventure) {
	return [
		new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setCustomId("freerepairkit")
				.setLabel("Take the Repair Kit")
				.setStyle(ButtonStyle.Primary)
		)
	];
}
