const Modifier = require("../../Classes/Modifier");

module.exports = new Modifier("Fire Absorb", 1)
	.setDescription("Convert Fire damage to health for @{stackCount} turns")
	.setIsBuff(true)
	.setIsDebuff(false)
	.setIsNonStacking(false)
	.setInverse("Water Absorb");
