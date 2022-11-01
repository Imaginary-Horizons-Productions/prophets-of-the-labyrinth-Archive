const ResourceTemplate = require("../../Classes/ResourceTemplate.js");
const RoomTemplate = require("../../Classes/RoomTemplate.js");

module.exports = new RoomTemplate("Hawk Fight", [
	new ResourceTemplate("gold", "1.5*25*n", "loot")
]).setDescription("A flock of birds of prey swoop down looking for a meal.")
	.setElement("Wind")
	.addEnemy("Bloodtail Hawk", "1.5*n");
