const RoomTemplate = require("../../Classes/RoomTemplate.js");

module.exports = new RoomTemplate()
	.setTypes("Battle")
	.setTitle("Hawk Fight")
	.setDescription("A flock of birds of prey swoop down looking for a meal.")
	.setElement("Wind")
	.addEnemy("Bloodtail Hawk", "1.5*n");
