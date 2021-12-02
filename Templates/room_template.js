const RoomTemplate = require("../../Classes/RoomTemplate.js")

module.exports = new RoomTemplate()
	.setTypes("type") // enum: "battle", "merchant", "event", "rest", "finalboss", "midboss", "forge"
	.setTitle("title")
	.setDescription("description")
	.setElement("embedColor");
