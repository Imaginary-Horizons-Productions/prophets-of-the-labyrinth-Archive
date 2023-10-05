const Modifier = require("../../Classes/Modifier");

module.exports = new Modifier("Earth Weakness", 1)
	.setDescription("Suffer Weakness to Earth damage for @{stackCount} rounds.")
	.setIsBuff(false)
	.setIsDebuff(true)
	.setIsNonStacking(false)
	.setInverse("Earth Absorb");
