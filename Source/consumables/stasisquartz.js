const ConsumableTemplate = require("../../Classes/ConsumableTemplate.js");
const { addModifier } = require("../combatantDAO.js");
const { selectSelf } = require("./selectors/selectSelf.js");

module.exports = new ConsumableTemplate("Stasis Quartz", "Grants the user 1 Stasis", selectSelf, effect)
	.setElement("Untyped")
	.setTargetTags("self", "delver")
	.setFlavorText([]);

function effect(targets, user, isCrit, adventure) {
	// +1 Stasis
	addModifier(user, { name: "Stasis", stacks: 1 });
	return `${user.getName()} enters Stasis.`;
}
