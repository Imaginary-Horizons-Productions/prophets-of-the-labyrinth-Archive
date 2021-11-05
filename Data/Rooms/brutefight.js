const Room = require("../../Classes/Room.js");

module.exports = new Room()
	.setType("battle")
	.setTitle("Brute Fight")
	.setDescription("These brutes are looking for a fight.")
	.addEnemy("brute", "2");
