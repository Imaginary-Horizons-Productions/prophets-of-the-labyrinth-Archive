const ConsumableTemplate = require("../../Classes/ConsumableTemplate.js");
const { gainHealth } = require("../combatantDAO.js");
const { selectSelf } = require("./selectors/selectSelf.js");

module.exports = new ConsumableTemplate("Vitamins", "Increases the user's max HP by 50", selectSelf, effect)
	.setElement("Untyped")
	.setTargetTags("self", "delver")
	.setFlavorText(["*Additional Notes*", "*Make sure to consume exactly the right number so your HP isn't divisible by 4*"]);

function effect(targets, user, isCrit, adventure) {
	// +50 max hp
	const gains = 50;
	user.maxHp += gains;
	gainHealth(user, gains, adventure);
	return "How healthy!";
}
