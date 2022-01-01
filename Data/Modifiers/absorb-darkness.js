const Modifier = require("../../Classes/Modifier");

module.exports = new Modifier("Darkness Absorb", 1)
	.setDescription("Convert Darkness damage to health for @{stackCount} turns")
	.setIsBuff(true)
	.setIsDebuff(false)
	.setIsNonStacking(false)
	.setInverse("Light Absorb");
