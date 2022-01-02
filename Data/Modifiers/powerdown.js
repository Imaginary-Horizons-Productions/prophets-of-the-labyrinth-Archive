const Modifier = require("../../Classes/Modifier");

module.exports = new Modifier("Power Down", 0)
	.setDescription("Decreases damage dealt by moves by @{stackCount}.")
	.setIsBuff(false)
	.setIsDebuff(true)
	.setIsNonStacking(false)
	.setInverse("Power Up");
