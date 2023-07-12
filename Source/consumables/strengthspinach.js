const ConsumableTemplate = require("../../Classes/ConsumableTemplate.js");
const { addModifier } = require("../combatantDAO.js");
const { selectSelf } = require("./selectors/selectSelf.js");

module.exports = new ConsumableTemplate("Strength Spinach", "Grants the user 50 Power Up", selectSelf, effect)
	.setElement("Untyped")
	.setCost(30)
	.setTargetTags("self", "delver")
	.setFlavorText([]);

function effect(targets, user, isCrit, adventure) {
	// +50 Power Up
	addModifier(user, { name: "Power Up", stacks: 50 });
	return `${user.getName()} is Powered Up.`;
}
