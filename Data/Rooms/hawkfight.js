const Room = require("../../Classes/Room.js");

module.exports = new Room()
	.setType("battle")
	.setTitle("Hawk Fight")
	.setDescription("A pair of birds of prey swoop down looking for a meal.")
	.addEnemy("Bloodtail Hawk", "2");
