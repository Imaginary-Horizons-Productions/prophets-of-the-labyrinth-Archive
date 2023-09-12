const Modifier = require("../../Classes/Modifier");

module.exports = new Modifier("Iron Fist Stance", 0)
	.setDescription("Increase Punch damage by @{stackCount*45} and stagger by @{stackCount*2}.")
	.setIsBuff(true)
	.setIsDebuff(false)
	.setIsNonStacking(false)
	.setInverse("");
