const RoomTemplate = require("../../Classes/RoomTemplate.js")

module.exports = new RoomTemplate()
	.setTypes("battle")
	.setTitle("Mechabee Fight")
	.setDescription("Some mechabees charge at you. In addition to starting a fight, it prompts you to wonder if mechabees are more mech or more bee.")
	.setElement("Darkness")
	.addEnemy("Mechabee", "n");
