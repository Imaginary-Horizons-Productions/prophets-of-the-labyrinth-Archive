const Modifier = require("../../Classes/Modifier");

module.exports = new Modifier("Quicken", 0)
	.setDescription("The unit's next @{stackCount} move(s) will have +@{stackCount*5} speed.")
	.setIsBuff(false)
	.setIsDebuff(true)
	.setIsNonStacking(false)
	.setInverse("Slow");
