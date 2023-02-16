const ResourceTemplate = require("../../Classes/ResourceTemplate.js");
const RoomTemplate = require("../../Classes/RoomTemplate.js");

module.exports = new RoomTemplate("Tortoise Fight", [
	new ResourceTemplate("gold", "80", "loot")
]).setDescription("The rocky terrain rises up to reveal a pair of shelled menaces.")
	.setElement("Earth")
	.addEnemy("Geode Tortoise", "2");
