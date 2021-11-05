const Modifier = require("../../Classes/Modifier");

module.exports = new Modifier("Quicken", 1)
	.setDescription("Increased speed for stack count turns.")
	.setIsBuff(false)
	.setIsDebuff(true)
	.setIsNonStacking(false)
	.setInverse("Slow");
