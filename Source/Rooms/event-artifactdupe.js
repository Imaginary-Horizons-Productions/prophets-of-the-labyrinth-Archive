const { ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const RoomTemplate = require("../../Classes/RoomTemplate.js");
const { getArtifact } = require("../Artifacts/_artifactDictionary.js");
const ResourceTemplate = require("../../Classes/ResourceTemplate.js");

module.exports = new RoomTemplate("Twin Pedestals", [
	new ResourceTemplate("roomAction", "1", "internal")
]).setDescription("There are two identical pedestals in this room. If you place an artifact on one, it'll duplicate onto the other.")
	.setElement("@{adventure}");

module.exports.buildUI = function (adventure) {
	const options = Object.keys(adventure.artifacts).map(artifact => {
		const count = adventure.getArtifactCount(artifact);
		return {
			label: artifact,
			description: getArtifact(artifact).dynamicDescription(count + 1),
			value: artifact
		}
	});
	if (options.length > 0) {
		return [
			new ActionRowBuilder().addComponents(
				new StringSelectMenuBuilder().setCustomId("artifactdupe")
					.setPlaceholder("Pick an artifact to duplicate...")
					.setOptions(options)
			)
		];
	} else {
		return [
			new ActionRowBuilder().addComponents(
				new StringSelectMenuBuilder().setCustomId("artifactdupe")
					.setPlaceholder("No artifacts to duplicate")
					.setDisabled(true)
					.setOptions([{ label: "placeholder", value: "placeholder" }])
			)
		];
	}
}
