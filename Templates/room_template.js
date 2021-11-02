const Room = require("../../Classes/Room.js")

module.exports = new Room()
	.setType("type") // enum: "battle", "event"
	.setTitle("title")
	.setDescription("description");
