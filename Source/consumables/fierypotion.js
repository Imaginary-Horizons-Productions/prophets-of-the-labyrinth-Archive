const ConsumableTemplate = require("../../Classes/ConsumableTemplate.js");
const { addModifier } = require("../combatantDAO.js");
const { getEmoji } = require("../elementHelpers.js");
const { selectSelf } = require("./selectors/selectSelf.js");

module.exports = new ConsumableTemplate("Fiery Potion", "Grants the user 1 Fire Absorb", selectSelf, effect)
	.setElement("Untyped")
	.setCost(30)
	.setTargetTags("self", "delver")
	.setFlavorText(["*Additional Notes*", "*Not to be confused with __Explosive Potion__. DO NOT apply to enemies.*"]);

function effect(targets, user, isCrit, adventure) {
	// +1 Fire Absorb
	addModifier(user, { name: "Fire Absorb", stacks: 1 });
	return `${user.getName()} now absorbs ${getEmoji("Fire")} damage.`;
}
