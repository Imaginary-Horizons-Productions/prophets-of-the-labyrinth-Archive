const Modifier = require("../../Classes/Modifier");

module.exports = new Modifier("Water Weakness", 1)
	.setDescription("Suffer Weakness to Water damage for @{stackCount} rounds.")
	.setIsBuff(false)
	.setIsDebuff(true)
	.setIsNonStacking(false)
	.setInverse("Water Absorb");
