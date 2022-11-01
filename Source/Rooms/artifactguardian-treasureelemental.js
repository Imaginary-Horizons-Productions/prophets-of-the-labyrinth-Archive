const ResourceTemplate = require("../../Classes/ResourceTemplate.js");
const RoomTemplate = require("../../Classes/RoomTemplate.js")

module.exports = new RoomTemplate("A windfall of treasure!", [
	new ResourceTemplate("artifact", "1", "loot")
]).setDescription("Floor to ceiling, gold coins, gems and other valuables are stacked in massive piles. Out of the corner of your eyes, you notice a mass of treasure meld together...")
	.setElement("Earth")
	.addEnemy("Treasure Elemental", "1");
