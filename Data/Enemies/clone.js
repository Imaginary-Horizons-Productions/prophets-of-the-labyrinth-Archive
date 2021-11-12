const Enemy = require("../../Classes/Enemy.js");

module.exports = new Enemy("Clone")
	.setHp(300)
	.setSpeed(100)
	.setElement("Clone")
	.setStaggerThreshold(3);
