const Modifier = require("../../Classes/Modifier");

module.exports = new Modifier("Curse of Midas", 0)
	.setDescription("Add @{stackCount} gold to loot for each 10 damage the bearer takes from moves.")
	.setIsBuff(false)
	.setIsDebuff(false)
	.setIsNonStacking(false)
	.setInverse("");
