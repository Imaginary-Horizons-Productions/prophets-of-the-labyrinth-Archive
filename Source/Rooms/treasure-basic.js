const ResourceTemplate = require("../../Classes/ResourceTemplate.js");
const RoomTemplate = require("../../Classes/RoomTemplate.js")

module.exports = new RoomTemplate("Treasure!", [
	new ResourceTemplate("roomAction", "1", "internal"),
	new ResourceTemplate("artifact", "1", "internal"),
	new ResourceTemplate("gold", "50*n", "internal"),
	new ResourceTemplate("equipment", "1", "internal", "?"),
	new ResourceTemplate("consumable", "1", "internal")
]).setDescription("A treasure box sits peacefully in the center of the room.")
	.setElement("@{adventure}");
