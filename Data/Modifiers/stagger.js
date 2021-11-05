const Modifier = require("../../Classes/Modifier");

module.exports = new Modifier("Stagger", 1)
	.setDescription("When stack count gets high enough, this combatant gets Stunned. Lose 1 stack per round.")
	.setIsBuff(false)
	.setIsDebuff(false)
	.setIsNonStacking(false)
	.setInverse("");
