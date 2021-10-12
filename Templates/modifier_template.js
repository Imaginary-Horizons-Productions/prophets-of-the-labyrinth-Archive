const Modifier = require("../../Classes/Modifier");

module.exports = new Modifier("name", 1)
	.setDescription()
	.setIsBuff()
	.setIsDebuff()
	.setIsNonStacking();
