const RoomTemplate = require("../../Classes/RoomTemplate.js")

module.exports = new RoomTemplate()
	.setTypes("Artifact Guardian")
	.setTitle("A windfall of treasure!")
	.setDescription("Floor to ceiling, gold coins, gems and other valuables are stacked in massive piles. Out of the corner of your eyes, you notice a mass of treasure meld together...")
	.setElement("Earth")
	.addEnemy("Treasure Elemental", "1");
