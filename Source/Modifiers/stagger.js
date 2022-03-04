const Modifier = require("../../Classes/Modifier");

module.exports = new Modifier("Stagger", 1)
	.setDescription("This combatant gets Stunned at @{poise} Stagger. Lose @{roundDecrement} stack per round.")
	.setIsBuff(false)
	.setIsDebuff(false)
	.setIsNonStacking(false)
	.setInverse("");
