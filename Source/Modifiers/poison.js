const Modifier = require("../../Classes/Modifier");

module.exports = new Modifier("Poison", 1)
	.setDescription("Deals @{stackCount*10} (+@{funnelCount*5} on enemies due to Spiral Funnels) unblockable damage after the sufferer's turn. Lose @{roundDecrement} stack per round.")
	.setIsBuff(false)
	.setIsDebuff(true)
	.setIsNonStacking(false)
	.setInverse("Regen");
