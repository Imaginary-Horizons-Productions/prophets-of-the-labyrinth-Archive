const Modifier = require("../../Classes/Modifier");

module.exports = new Modifier("Water Absorb", 1)
	.setDescription("Convert Water damage to health for @{stackCount} turns")
	.setIsBuff(true)
	.setIsDebuff(false)
	.setIsNonStacking(false)
	.setInverse("Fire Absorb");
