const ConsumableTemplate = require("../../Classes/ConsumableTemplate.js");
const { gainHealth } = require("../combatantDAO.js");

module.exports = new ConsumableTemplate("Health Potion", "Heals the user by 25% of their max HP.", selectTargets, effect)
	.setElement("Untyped")
	.setTargetTags("self", "delver")
	.setFlavorText([]);

function selectTargets(userIndex, adventure) {
	// self
	const team = "self";
	const index = userIndex;
	return [[team, index]];
}

function effect(target, user, isCrit, adventure) {
	// +25% max hp
	return gainHealth(user, Math.floor(user.maxHp * 0.25), adventure);
}
