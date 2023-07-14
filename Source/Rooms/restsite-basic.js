const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const ResourceTemplate = require("../../Classes/ResourceTemplate.js");
const RoomTemplate = require("../../Classes/RoomTemplate.js");
const { SAFE_DELIMITER } = require("../../constants.js");

module.exports = new RoomTemplate("Rest Site", [
	new ResourceTemplate("roomAction", "n", "internal"),
	new ResourceTemplate("challenge", "2", "internal")
]).setDescription("The room contains a rest site... and a mysterious challenger hanging out in the corner.")
	.setElement("@{adventure}");

module.exports.buildUI = function (adventure) {
	const healPercent = Math.trunc(30 * (1 - (adventure.getChallengeIntensity("Restless") / 100)));
	return [
		new ActionRowBuilder().addComponents(
			new ButtonBuilder().setCustomId(`rest${SAFE_DELIMITER}${healPercent}`)
				.setLabel(`Rest [+${healPercent}% hp]`)
				.setEmoji("1️⃣")
				.setStyle(ButtonStyle.Primary),
			new ButtonBuilder().setCustomId("viewchallenges")
				.setLabel("Take a challenge")
				.setEmoji("1️⃣")
				.setStyle(ButtonStyle.Danger)
		)
	]
}
