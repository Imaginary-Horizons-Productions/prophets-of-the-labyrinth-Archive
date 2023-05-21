const ConsumableTemplate = require("../../Classes/ConsumableTemplate.js");
const { addModifier, getFullName } = require("../combatantDAO.js");
const { selectSelf } = require("./selectors/selectSelf.js");

module.exports = new ConsumableTemplate("Salt of Oblivion", "Grants the user 1 Oblivious", selectSelf, effect)
	.setElement("Untyped")
	.setTargetTags("self", "delver")
	.setFlavorText([]);

function effect(target, user, isCrit, adventure) {
	// +1 Oblivious
	addModifier(user, { name: "Oblivious", stacks: 1 });
	return `${getFullName(user, adventure.room.enemyTitles)} gains Oblivious.`;
}
