const Modifier = require("../../Classes/Modifier");

module.exports = new Modifier("Power Up", 0)
	.setDescription("Increases damage dealt by moves by @{stackCount}.")
	.setIsBuff(true)
	.setIsDebuff(false)
	.setIsNonStacking(false)
	.setInverse("Power Down");
