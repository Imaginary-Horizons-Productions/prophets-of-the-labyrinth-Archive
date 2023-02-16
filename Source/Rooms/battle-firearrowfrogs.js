const ResourceTemplate = require("../../Classes/ResourceTemplate.js");
const RoomTemplate = require("../../Classes/RoomTemplate.js");

module.exports = new RoomTemplate("Frog Fight", [
	new ResourceTemplate("gold", "25*n", "loot")
]).setDescription("A blaze of orange and red in the muck the outs itself as a warning sign to a blast of heated mud and venom.")
	.setElement("Fire")
	.addEnemy("Fire-Arrow Frog", "n");
