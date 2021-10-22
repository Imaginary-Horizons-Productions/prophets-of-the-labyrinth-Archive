const Modifier = require("../../Classes/Modifier");

module.exports = new Modifier("powerdown", 0)
	.setDescription("Decreases damage dealt my moves by stack count.")
	.setIsBuff(false)
	.setIsDebuff(true)
	.setIsNonStacking(false)
	.setInverse("powerup");
