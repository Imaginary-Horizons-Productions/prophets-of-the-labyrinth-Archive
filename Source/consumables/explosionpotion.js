const ConsumableTemplate = require("../../Classes/ConsumableTemplate.js");
const { dealDamage } = require("../combatantDAO.js");
const { selectAllFoes } = require("./selectors/selectAllFoes.js");

module.exports = new ConsumableTemplate("Explosion Potion", "Deal 75 damage to all enemies", selectAllFoes, effect)
	.setElement("Untyped")
	.setTargetTags("all", "enemy")
	.setFlavorText(["*Additional Notes*", "*Not to be confused with __Fiery Potion__. DO NOT apply to self.*"]);

function effect(target, user, isCrit, adventure) {
	// 75 damage
	return dealDamage(target, user, 75, false, "Untyped", adventure);
}
