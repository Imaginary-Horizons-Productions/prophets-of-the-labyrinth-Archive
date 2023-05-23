const ConsumableTemplate = require("../../Classes/ConsumableTemplate.js");
const { addModifier, getFullName } = require("../combatantDAO.js");
const { getEmoji } = require("../elementHelpers.js");
const { selectSelf } = require("./selectors/selectSelf.js");

module.exports = new ConsumableTemplate("Fiery Potion", "Grants the user 1 Fire Absorb", selectSelf, effect)
	.setElement("Untyped")
	.setTargetTags("self", "delver")
	.setFlavorText(["*Additional Notes*", "*Not to be confused with __Explosive Potion__. DO NOT apply to enemies.*"]);

function effect(targets, user, isCrit, adventure) {
	// +1 Fire Absorb
	addModifier(user, { name: "Fire Absorb", stacks: 1 });
	return `${getFullName(user, adventure.room.enemyTitles)} now absorbs ${getEmoji("Fire")} damage.`;
}
