const Enemy = require("../../Classes/Enemy.js");

module.exports = new Enemy("@{clone}")
	.setHp(300)
	.setSpeed(100)
	.setElement("@{clone}")
	.setStaggerThreshold(3)
	.markAsBoss();
