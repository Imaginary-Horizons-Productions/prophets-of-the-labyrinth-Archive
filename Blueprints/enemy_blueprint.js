const Enemy = require("../../Classes/Enemy.js");

// import from modules that depend on /Config
// let ;
module.exports.injectConfig = function (isProduction) {
	({} = require("../enemyDAO.js").injectConfig(isProduction));
	return this;
}

module.exports = new Enemy("name")
	.setHp()
	.setSpeed()
	.setElement() // enum: "Fire", "Water", "Earth", "Wind", "Light", "Darkness", "@{adventure}", "@{adventureOpposite}"
	.setStaggerThreshold()
	.setFirstAction()
	.addAction() // {name: string, effect: function, selector: function, next: function}
	.setBounty();
