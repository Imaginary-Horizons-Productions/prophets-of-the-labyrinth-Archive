const Enemy = require("../../Classes/Enemy.js");

module.exports = new Enemy("name")
	.setFirstAction()
	.addAction() // {name: string, effect: function, selector: function, next: function}
	.setHp()
	.setSpeed()
	.setElement()
	.setStaggerThreshold();
