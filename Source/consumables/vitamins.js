const ConsumableTemplate = require("../../Classes/ConsumableTemplate.js");
const { gainHealth } = require("../combatantDAO.js");

module.exports = new ConsumableTemplate("Vitamins", "Increases the user's max HP by 50.", selectTargets, effect)
	.setElement("Untyped")
	.setTargetTags("self", "delver")
	.setFlavorText(["*Additional Notes*", "*Make sure to consume exactly the right number so your HP isn't divisible by 4*"]);

function selectTargets(userIndex, adventure) {
	// self
	const team = "self";
	const index = userIndex;
	return [[team, index]];
}

function effect(target, user, isCrit, adventure) {
	// +50 max hp
	const gains = 50;
	user.maxHp += gains;
	gainHealth(user, gains, adventure);
	return "How healthy!";
}
