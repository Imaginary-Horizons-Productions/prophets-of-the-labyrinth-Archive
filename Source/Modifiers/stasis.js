const Modifier = require("../../Classes/Modifier");

module.exports = new Modifier("Stasis", 0)
	.setDescription("Ignore the next @{stackCount} attempt(s) to remove buffs or debuffs (any number of stacks).")
	.setIsBuff(false)
	.setIsDebuff(false)
	.setIsNonStacking(false)
	.setInverse("");
