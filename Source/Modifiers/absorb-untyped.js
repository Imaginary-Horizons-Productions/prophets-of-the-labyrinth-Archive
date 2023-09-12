const Modifier = require("../../Classes/Modifier");

module.exports = new Modifier("Untyped Absorb", 1)
	.setDescription("Convert Untyped damage to health for @{stackCount} rounds.")
	.setIsBuff(true)
	.setIsDebuff(false)
	.setIsNonStacking(false)
	.setInverse("Untyped Weakness");
