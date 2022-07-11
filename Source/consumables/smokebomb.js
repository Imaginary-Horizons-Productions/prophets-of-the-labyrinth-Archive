const ConsumableTemplate = require("../../Classes/ConsumableTemplate.js");
const { addModifier, getFullName } = require("../combatantDAO.js");

module.exports = new ConsumableTemplate("Smoke Bomb", "Grants the user 2 Evade", selectTargets, effect)
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
	// +2 Evade
	addModifier(user, { name: "Evade", stacks: 2 });
	return `${getFullName(user, adventure.room.enemyTitles)} becomes more evasive.`;
}
