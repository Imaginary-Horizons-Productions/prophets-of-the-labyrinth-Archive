const Modifier = require("../../Classes/Modifier");

module.exports = new Modifier("Stun", 100)
	.setDescription("The combatant's next turn is skipped.")
	.setIsBuff(false)
	.setIsDebuff(false)
	.setIsNonStacking(true)
	.setInverse("");
