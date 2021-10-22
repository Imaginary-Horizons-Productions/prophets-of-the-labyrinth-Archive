const Modifier = require("../../Classes/Modifier");

module.exports = new Modifier("slow", 1)
	.setDescription("Reduced speed for stack count turns.")
	.setIsBuff(false)
	.setIsDebuff(true)
	.setIsNonStacking(false)
	.setInverse("");
