const Enemy = require("../../Classes/Enemy.js");

module.exports = new Enemy("name")
	.setFirstAction()
	.addAction() // {name: string, effect: function, selector: function, next: function}
	.setBounty()
	.setHp()
	.setSpeed()
	.setElement()
	.setStaggerThreshold();
