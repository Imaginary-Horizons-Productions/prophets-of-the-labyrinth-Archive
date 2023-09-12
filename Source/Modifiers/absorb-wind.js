const Modifier = require("../../Classes/Modifier");

module.exports = new Modifier("Wind Absorb", 1)
	.setDescription("Convert Wind damage to health for @{stackCount} rounds.")
	.setIsBuff(true)
	.setIsDebuff(false)
	.setIsNonStacking(false)
	.setInverse("Wind Weakness");
