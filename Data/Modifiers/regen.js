const Modifier = require("../../Classes/Modifier");

module.exports = new Modifier("Regen", 1)
	.setDescription("Gain 10x stack hp after the bearer's turn. Lose 1 stack per round.")
	.setIsBuff(true)
	.setIsDebuff(false)
	.setIsNonStacking(false)
	.setInverse("Poison");
