const ConsumableTemplate = require("../../Classes/ConsumableTemplate.js");
const { gainHealth } = require("../combatantDAO.js");
const { selectSelf } = require("../enemyDAO.js");

module.exports = new ConsumableTemplate("Health Potion", "Heals the user by 25% of their max HP", selectSelf, effect)
	.setElement("Untyped")
	.setTargetTags("self", "delver")
	.setFlavorText([]);

function effect(targets, user, isCrit, adventure) {
	// +25% max hp
	return gainHealth(user, Math.floor(user.maxHp * 0.25), adventure);
}
