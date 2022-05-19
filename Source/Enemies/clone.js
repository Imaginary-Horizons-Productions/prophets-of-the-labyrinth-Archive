const Enemy = require("../../Classes/Enemy.js");

module.exports = new Enemy("@{clone}")
	.setBounty(50)
	.setHp(300)
	.setSpeed(100)
	.setElement("@{clone}")
	.setStaggerThreshold(3);
