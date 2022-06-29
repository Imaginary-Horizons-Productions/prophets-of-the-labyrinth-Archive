const Modifier = require("../../Classes/Modifier");

module.exports = new Modifier("Vigilance", 1)
	.setDescription("The combatant will retain block for @{stackCount} rounds.")
	.setIsBuff(true)
	.setIsDebuff(false)
	.setIsNonStacking(false)
	.setInverse("");
