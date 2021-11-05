const Room = require("../../Classes/Room.js");

module.exports = new Room()
	.setType("boss")
	.setTitle("Brute Convention")
	.setDescription("You stumble upon what appears to be a brute convention. The keynote brute interrupts their presentation on \"How to be Faceless\" to point out that a practical opportunity to work on mugging skills has just entered the room.")
	.addEnemy("brute", "5");
