const Modifier = require("../../Classes/Modifier");

module.exports = new Modifier("Untyped Weakness", 1)
	.setDescription("Suffer Weakness to Untyped damage for @{stackCount} rounds.")
	.setIsBuff(false)
	.setIsDebuff(true)
	.setIsNonStacking(false)
	.setInverse("Untyped Absorb");
