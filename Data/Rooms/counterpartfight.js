const Room = require("../../Classes/Room.js")

module.exports = new Room()
	.setType("battle")
	.setTitle("Counterpart Fight")
	.setDescription("A long hall of wavy mirrors sits silently between the party and the door... until a bunch of shadows step out of the mirror and attack the party!")
	.addEnemy("mirrorclone", "n");
