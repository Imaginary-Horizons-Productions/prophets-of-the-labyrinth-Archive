const Enemy = require("../../Classes/Enemy.js");

module.exports = new Enemy("name")
	.setHp()
	.setSpeed()
	.setElement() // enum: "fire", "water", "earth", "wind", "light", "dark"
	.setStaggerThreshold()
	.addAction();
