const Modifier = require("../../Classes/Modifier");

module.exports = new Modifier("Exposed", "all")
	.setDescription("Increase the next @{stackCount} set(s) of incoming damage by 50%. Lose @{roundDecrement} stacks each round.")
	.setIsBuff(false)
	.setIsDebuff(true)
	.setIsNonStacking(false)
	.setInverse("Evade");
