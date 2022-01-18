const Modifier = require("../../Classes/Modifier");

module.exports = new Modifier("Light Absorb", 1)
	.setDescription("Convert Light damage to health for @{stackCount} rounds.")
	.setIsBuff(true)
	.setIsDebuff(false)
	.setIsNonStacking(false)
	.setInverse("Darkness Absorb");
