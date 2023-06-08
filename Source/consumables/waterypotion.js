const ConsumableTemplate = require("../../Classes/ConsumableTemplate.js");
const { addModifier } = require("../combatantDAO.js");
const { getEmoji } = require("../elementHelpers.js");
const { selectSelf } = require("./selectors/selectSelf.js");

module.exports = new ConsumableTemplate("Watery Potion", "Grants the user 1 Water Absorb", selectSelf, effect)
	.setElement("Untyped")
	.setTargetTags("self", "delver")
	.setFlavorText(["*Additional Note*", "Apply directly to the forehead."]);

function effect(targets, user, isCrit, adventure) {
	// +1 Water Absorb
	addModifier(user, { name: "Water Absorb", stacks: 1 });
	return `${user.getName()} now absorbs ${getEmoji("Water")} damage.`;
}
