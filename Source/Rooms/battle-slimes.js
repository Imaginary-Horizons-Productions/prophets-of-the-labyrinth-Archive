const RoomTemplate = require("../../Classes/RoomTemplate.js");

module.exports = new RoomTemplate()
	.setTypes("Battle")
	.setTitle("Slime Fight")
	.setDescription("Some slimes and oozes approach...")
	.setElement("@{adventure}")
	.addEnemy("@{adventure} Slime", "0.5*n")
	.addEnemy("@{adventureOpposite} Ooze", "0.5*n");
