const RoomTemplate = require("../../Classes/RoomTemplate.js");

module.exports = new RoomTemplate()
	.setTypes("Battle")
	.setTitle("Tortoise Fight")
	.setDescription("The rocky terrain rises up to reveal a pair of shelled menaces.")
	.setElement("Earth")
	.addEnemy("Geode Tortoise", "2");
