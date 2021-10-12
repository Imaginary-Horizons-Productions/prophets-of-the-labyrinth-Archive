const Modifier = require("../../Classes/Modifier");

module.exports = new Modifier("powerup", 0)
	.setDescription("Increases damage dealt my moves by stack count.")
	.setIsBuff(true)
	.setIsDebuff(false)
	.setIsNonStacking(false);
