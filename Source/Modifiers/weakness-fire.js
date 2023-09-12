const Modifier = require("../../Classes/Modifier");

module.exports = new Modifier("Fire Weakness", 1)
	.setDescription("Suffer Weakness to Fire damage for @{stackCount} rounds.")
	.setIsBuff(false)
	.setIsDebuff(true)
	.setIsNonStacking(false)
	.setInverse("Fire Absorb");
