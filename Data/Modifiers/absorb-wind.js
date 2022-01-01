const Modifier = require("../../Classes/Modifier");

module.exports = new Modifier("Wind Absorb", 1)
	.setDescription("Convert Wind damage to health for @{stackCount} turns")
	.setIsBuff(true)
	.setIsDebuff(false)
	.setIsNonStacking(false)
	.setInverse("Earth Absorb");
