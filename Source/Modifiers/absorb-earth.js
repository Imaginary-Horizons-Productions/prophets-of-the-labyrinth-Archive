const Modifier = require("../../Classes/Modifier");

module.exports = new Modifier("Earth Absorb", 1)
	.setDescription("Convert Earth damage to health for @{stackCount} rounds.")
	.setIsBuff(true)
	.setIsDebuff(false)
	.setIsNonStacking(false)
	.setInverse("Wind Absorb");
