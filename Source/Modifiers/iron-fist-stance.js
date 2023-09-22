const Modifier = require("../../Classes/Modifier");

module.exports = new Modifier("Iron Fist Stance", 0)
	.setDescription("Increase Punch damage by @{stackCount*45} and changes its element to yours.")
	.setIsBuff(true)
	.setIsDebuff(false)
	.setIsNonStacking(false)
	.setInverse("");
