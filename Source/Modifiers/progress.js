const Modifier = require("../../Classes/Modifier");

module.exports = new Modifier("Progress", 0)
	.setDescription("The Elkemist completes its potion when progress reaches 100. Stun the Elkemist to inhibit some progress.")
	.setIsBuff(false)
	.setIsDebuff(false)
	.setIsNonStacking(false)
	.setInverse("");
