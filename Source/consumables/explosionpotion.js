const ConsumableTemplate = require("../../Classes/ConsumableTemplate.js");
const { dealDamage } = require("../combatantDAO.js");
const { selectAllFoes } = require("./selectors/selectAllFoes.js");

module.exports = new ConsumableTemplate("Explosion Potion", "Deal 75 damage to all enemies", selectAllFoes, effect)
	.setElement("Untyped")
	.setCost(30)
	.setTargetTags("all", "enemy")
	.setFlavorText(["*Additional Notes*", "*Not to be confused with __Fiery Potion__. DO NOT apply to self.*"]);

function effect(targets, user, isCrit, adventure) {
	// 75 damage
	return dealDamage(targets, user, 75, false, "Untyped", adventure);
}
