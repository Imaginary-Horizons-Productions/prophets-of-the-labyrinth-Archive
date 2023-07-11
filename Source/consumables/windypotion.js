const ConsumableTemplate = require("../../Classes/ConsumableTemplate.js");
const { addModifier } = require("../combatantDAO.js");
const { getEmoji } = require("../elementHelpers.js");
const { selectSelf } = require("./selectors/selectSelf.js");

module.exports = new ConsumableTemplate("Windy Potion", "Grants the user 1 Wind Absorb", selectSelf, effect)
	.setElement("Untyped")
	.setTargetTags("self", "delver")
	.setFlavorText([]);

function effect(targets, user, isCrit, adventure) {
	// +1 Wind Absorb
	addModifier(user, { name: "Wind Absorb", stacks: 1 });
	return `${user.getName()} now absorbs ${getEmoji("Wind")} damage.`;
}
