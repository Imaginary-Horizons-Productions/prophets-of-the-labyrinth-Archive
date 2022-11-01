const ResourceTemplate = require("../../Classes/ResourceTemplate.js");
const RoomTemplate = require("../../Classes/RoomTemplate.js")

module.exports = new RoomTemplate("A Slimy Throneroom", [
	new ResourceTemplate("artifact", "1", "loot"),
	new ResourceTemplate("gold", "50*n", "loot")
]).setDescription("A long hall of wavy mirrors sits silently between the party and the door... until a bunch of shadows step out of the mirror and attack the party!")
	.setElement("@{adventure}")
	.addEnemy("Royal Slime", "0.5*n");
