const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const ResourceTemplate = require("../../Classes/ResourceTemplate.js");
const RoomTemplate = require("../../Classes/RoomTemplate.js")

module.exports = new RoomTemplate("Free Gold?", [
	new ResourceTemplate("gold", "300", "internal")
]).setDescription("A large pile of gold sits quietly in the middle of the room, seemingly alone.")
	.setElement("Fire");

module.exports.buildUI = function (adventure) {
	return [
		new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setCustomId("getgoldonfire")
				.setLabel("Would be a waste to leave it there [+300 gold]")
				.setStyle(ButtonStyle.Danger)
		)
	];
}
