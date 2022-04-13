const RoomTemplate = require("../../Classes/RoomTemplate.js");

module.exports = new RoomTemplate()
	.setTypes("Battle")
	.setTitle("Frog Fight")
	.setDescription("A blaze of orange and red in the muck the outs itself as a warning sign to a blast of heated mud and venom.")
	.setElement("Fire")
	.addEnemy("Fire-Arrow Frog", "n");
