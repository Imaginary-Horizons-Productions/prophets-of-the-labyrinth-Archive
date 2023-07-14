const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const RoomTemplate = require("../../Classes/RoomTemplate.js")

module.exports = new RoomTemplate("Empty Room", [
]).setDescription("This room is empty. Lucky you?")
	.setElement("Untyped");

module.exports.buildUI = function (adventure) {
	return [
		new ActionRowBuilder().addComponents(
			new ButtonBuilder().setCustomId("continue")
				.setEmoji("👑")
				.setLabel("Move on")
				.setStyle(ButtonStyle.Secondary)
		)
	];
}
