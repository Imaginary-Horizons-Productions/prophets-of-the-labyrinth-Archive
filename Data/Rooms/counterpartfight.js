const Room = require("../../Classes/Room.js")

module.exports = new Room()
	.setType("boss")
	.setTitle("Hall of Mirrors")
	.setDescription("A long hall of wavy mirrors sits silently between the party and the door... until a bunch of shadows step out of the mirror and attack the party!")
	.addEnemy("@{clone}", "n");
