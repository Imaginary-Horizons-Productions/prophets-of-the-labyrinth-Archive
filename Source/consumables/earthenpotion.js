const ConsumableTemplate = require("../../Classes/ConsumableTemplate.js");
const { addModifier } = require("../combatantDAO.js");
const { getEmoji } = require("../elementHelpers.js");
const { selectSelf } = require("./selectors/selectSelf.js");

module.exports = new ConsumableTemplate("Earthen Potion", "Grants the user 1 Earth Absorb", selectSelf, effect)
	.setElement("Untyped")
	.setTargetTags("self", "delver")
	.setFlavorText(["*Legally Required Addtional Note*", "*Not to be confused with __Explosive Potion__.*"]);

function effect(targets, user, isCrit, adventure) {
	// +1 Earth Absorb
	addModifier(user, { name: "Earth Absorb", stacks: 1 });
	return `${user.getName()} now absorbs ${getEmoji("Earth")} damage.`;
}
