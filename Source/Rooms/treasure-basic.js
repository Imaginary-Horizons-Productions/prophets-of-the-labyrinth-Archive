const ResourceTemplate = require("../../Classes/ResourceTemplate.js");
const RoomTemplate = require("../../Classes/RoomTemplate.js")

module.exports = new RoomTemplate("Treasure!", [
	new ResourceTemplate("roomAction", "1", "internal"),
	new ResourceTemplate("artifact", "1", "always"),
	new ResourceTemplate("gold", "150*n", "always"),
	new ResourceTemplate("equipment", "1", "always", "?"),
	new ResourceTemplate("consumable", "1", "always")
]).setDescription("A treasure box sits peacefully in the center of the room.")
	.setElement("@{adventure}");
