const ResourceTemplate = require("../../Classes/ResourceTemplate.js");
const RoomTemplate = require("../../Classes/RoomTemplate.js")

module.exports = new RoomTemplate("Mechabee Fight", [
	new ResourceTemplate("gold", "25*n", "loot")
]).setDescription("Some mechabees charge at you. In addition to starting a fight, it prompts you to wonder if mechabees are more mech or more bee.")
	.setElement("Earth")
	.addEnemy("Mechabee", "n");
