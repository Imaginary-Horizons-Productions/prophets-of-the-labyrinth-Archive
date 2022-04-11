const RoomTemplate = require("../../Classes/RoomTemplate.js")

module.exports = new RoomTemplate()
	.setTypes("Final Battle")
	.setTitle("A Northern Laboratory")
	.setDescription("Flasks, beakers, vials and a myriad unknown substances line the innumerable tables and shelves of this room. An elk wanders from table to whiteboard to shelf, muttering various alchemical formuae to itself and taking absolutely no notice of the party.")
	.setElement("Water")
	.addEnemy("Elkemist", "1");
