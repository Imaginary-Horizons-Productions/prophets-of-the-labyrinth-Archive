const RoomTemplate = require("../../Classes/RoomTemplate.js");

module.exports = new RoomTemplate()
	.setTypes("battle")
	.setTitle("Slime Fight")
	.setDescription("Some slimes and oozes approach...")
	.addEnemy("@{adventure} Slime", "n")
	.addEnemy("@{adventureReverse} Ooze", "n");
