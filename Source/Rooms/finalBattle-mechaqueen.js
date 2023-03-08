const RoomTemplate = require("../../Classes/RoomTemplate.js")

module.exports = new RoomTemplate()
	.setTypes("Final Battle")
	.setTitle("The Hexagon")
	.setDescription("Myriad six-sided holograms flicker on as you enter the room displaying formations, statistics, and supply information. An alarm blares, and some mechabees (and their queen!) charge you. It dawns on you: they are in fact, more bee than mech.")
	.setElement("Earth")
	.addEnemy("Mecha Queen", "1")
	.addEnemy("Mechabee", "n");
