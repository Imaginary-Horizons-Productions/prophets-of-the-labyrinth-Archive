const Modifier = require("../../Classes/Modifier");

module.exports = new Modifier("Wind Weakness", 1)
	.setDescription("Suffer Weakness to Wind damage for @{stackCount} rounds.")
	.setIsBuff(false)
	.setIsDebuff(true)
	.setIsNonStacking(false)
	.setInverse("Wind Absorb");
