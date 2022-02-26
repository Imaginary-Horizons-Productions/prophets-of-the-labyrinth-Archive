const Modifier = require("../../Classes/Modifier");

module.exports = new Modifier("Evade", "all")
	.setDescription("Negate the next @{stackCount} set(s) of incoming damage. Lose @{roundDecrement} stacks each round.")
	.setIsBuff(true)
	.setIsDebuff(false)
	.setIsNonStacking(false)
	.setInverse("Exposed");
