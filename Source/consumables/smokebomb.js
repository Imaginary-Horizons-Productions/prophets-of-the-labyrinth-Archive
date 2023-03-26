const ConsumableTemplate = require("../../Classes/ConsumableTemplate.js");
const { addModifier, getFullName } = require("../combatantDAO.js");
const { selectSelf } = require("./selectors/selectSelf.js");

module.exports = new ConsumableTemplate("Smoke Bomb", "Grants the user 2 Evade", selectSelf, effect)
	.setElement("Untyped")
	.setTargetTags("self", "delver")
	.setFlavorText(["___'s Commentary", "Take advantage of an enemy being blinded to run away? Who would do that?"]);

function effect(target, user, isCrit, adventure) {
	// +2 Evade
	addModifier(user, { name: "Evade", stacks: 2 });
	return `${getFullName(user, adventure.room.enemyTitles)} becomes more evasive.`;
}
