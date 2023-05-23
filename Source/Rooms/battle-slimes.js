const ResourceTemplate = require("../../Classes/ResourceTemplate.js");
const RoomTemplate = require("../../Classes/RoomTemplate.js");

module.exports = new RoomTemplate("Slime Fight", [
	new ResourceTemplate("gold", "25*n", "loot")
]).setDescription("Some slimes and oozes approach...")
	.setElement("@{adventure}")
	.addEnemy("@{adventure} Slime", "0.5*n")
	.addEnemy("@{adventureOpposite} Ooze", "0.5*n");
