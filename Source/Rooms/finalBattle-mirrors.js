const RoomTemplate = require("../../Classes/RoomTemplate.js")

module.exports = new RoomTemplate()
	.setTypes("Final Battle")
	.setTitle("Hall of Mirrors")
	.setDescription("A long hall of wavy mirrors sits silently between the party and the door... until a bunch of shadows step out of the mirror and attack the party!")
	.setElement("Untyped")
	.addEnemy("@{clone}", "n");
