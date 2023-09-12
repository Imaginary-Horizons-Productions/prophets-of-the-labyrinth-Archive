const Modifier = require("../../Classes/Modifier");

module.exports = new Modifier("Fire Absorb", 1)
	.setDescription("Convert Fire damage to health for @{stackCount} rounds.")
	.setIsBuff(true)
	.setIsDebuff(false)
	.setIsNonStacking(false)
	.setInverse("Fire Weakness");
