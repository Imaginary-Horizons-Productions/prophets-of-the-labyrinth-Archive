const RoomTemplate = require("../../Classes/RoomTemplate.js");

module.exports = new RoomTemplate()
	.setTypes("battle")
	.setTitle("Tortoise Fight")
	.setDescription("The rocky terrain rises up to reveal a pair of shelled menaces.")
	.addEnemy("Geode Tortoise", "2");
