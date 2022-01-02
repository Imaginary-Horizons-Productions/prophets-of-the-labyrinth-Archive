const Modifier = require("../../Classes/Modifier");

module.exports = new Modifier("Regen", 1)
	.setDescription("Gain @{stackCount*10} hp after the bearer's turn. Lose @{roundDecrement} stack per round.")
	.setIsBuff(true)
	.setIsDebuff(false)
	.setIsNonStacking(false)
	.setInverse("Poison");
