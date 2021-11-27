const Room = require("../../Classes/Room.js");

module.exports = new Room()
	.setType("battle")
	.setTitle("Tortoise Fight")
	.setDescription("The rocky terrain rises up to reveal a pair of shelled menaces.")
	.addEnemy("Geode Tortoise", "2");
