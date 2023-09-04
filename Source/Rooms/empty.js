const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const RoomTemplate = require("../../Classes/RoomTemplate.js");
const { SAFE_DELIMITER } = require("../../constants.js");

module.exports = new RoomTemplate("Empty Room", [
]).setDescription("This room is empty. Lucky you?")
	.setElement("Untyped");

module.exports.buildUI = function (adventure) {
	return [
		new ActionRowBuilder().addComponents(
			new ButtonBuilder().setCustomId(`routevote${SAFE_DELIMITER}Battle${SAFE_DELIMITER}${adventure.depth}`)
				.setLabel("Move on to a Battle")
				.setStyle(ButtonStyle.Secondary)
		)
	];
}
