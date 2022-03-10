const Enemy = require("../../Classes/Enemy.js");

// import from modules that depend on /Config
// let ;
module.exports.injectConfig = function (isProduction) {
	return new Enemy("@{clone}")
	.setHp(300)
	.setSpeed(100)
	.setElement("@{clone}")
	.setStaggerThreshold(3)
	.setBounty(50);
}
