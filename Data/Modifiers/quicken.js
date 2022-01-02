const Modifier = require("../../Classes/Modifier");

module.exports = new Modifier("Quicken", 1)
	.setDescription("Increased speed for @{stackCount} rounds.")
	.setIsBuff(false)
	.setIsDebuff(true)
	.setIsNonStacking(false)
	.setInverse("Slow");
