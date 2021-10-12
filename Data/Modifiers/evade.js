const Modifier = require("../../Classes/Modifier");

module.exports = new Modifier("evade", 100)
	.setDescription("Negate the next set of incoming damage next round.")
	.setIsBuff(true)
	.setIsDebuff(false)
	.setIsNonStacking(false);
