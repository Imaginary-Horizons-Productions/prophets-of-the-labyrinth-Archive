const ConsumableTemplate = require("../../Classes/ConsumableTemplate.js");
const { addModifier } = require("../combatantDAO.js");
const { selectSelf } = require("./selectors/selectSelf.js");

module.exports = new ConsumableTemplate("Quick Pepper", "Grants the user 3 Quicken", selectSelf, effect)
	.setElement("Untyped")
	.setCost(30)
	.setTargetTags("self", "delver")
	.setFlavorText([]);

function effect(targets, user, isCrit, adventure) {
	// +3 Quicken
	addModifier(user, { name: "Quicken", stacks: 3 });
	return `${user.getName()} gains Quicken.`;
}
