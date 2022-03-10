const Modifier = require("../../Classes/Modifier");

module.exports = new Modifier("Slow", 0)
	.setDescription("The unit's next @{stackCount} move(s) will have -10 speed.")
	.setIsBuff(false)
	.setIsDebuff(true)
	.setIsNonStacking(false)
	.setInverse("Slow");
