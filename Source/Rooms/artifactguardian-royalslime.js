const RoomTemplate = require("../../Classes/RoomTemplate.js")

module.exports = new RoomTemplate()
	.setTypes("Artifact Guardian")
	.setTitle("A Slimy Throneroom")
	.setDescription("A long hall of wavy mirrors sits silently between the party and the door... until a bunch of shadows step out of the mirror and attack the party!")
	.setElement("@{adventure}")
	.addEnemy("Royal Slime", "0.5*n");
