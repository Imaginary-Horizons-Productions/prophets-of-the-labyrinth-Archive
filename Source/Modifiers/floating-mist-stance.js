const Modifier = require("../../Classes/Modifier");

module.exports = new Modifier("Floating Mist Stance", 0)
	.setDescription("Increase Punch stagger by @{stackCount*2} and gain @{stackCount*2} Evade each round.")
	.setIsBuff(true)
	.setIsDebuff(false)
	.setIsNonStacking(false)
	.setInverse("");
