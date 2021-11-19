const Modifier = require("../../Classes/Modifier");

module.exports = new Modifier("Poison", 1)
	.setDescription("Deals 10x stack unblockable damage after the sufferer's turn. Lose 1 stack per round.")
	.setIsBuff(false)
	.setIsDebuff(true)
	.setIsNonStacking(false)
	.setInverse("Regen");
