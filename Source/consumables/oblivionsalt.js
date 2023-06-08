const ConsumableTemplate = require("../../Classes/ConsumableTemplate.js");
const { addModifier } = require("../combatantDAO.js");
const { selectSelf } = require("./selectors/selectSelf.js");

module.exports = new ConsumableTemplate("Salt of Oblivion", "Grants the user 1 Oblivious", selectSelf, effect)
	.setElement("Untyped")
	.setTargetTags("self", "delver")
	.setFlavorText([]);

function effect(targets, user, isCrit, adventure) {
	// +1 Oblivious
	addModifier(user, { name: "Oblivious", stacks: 1 });
	return `${user.getName()} gains Oblivious.`;
}
