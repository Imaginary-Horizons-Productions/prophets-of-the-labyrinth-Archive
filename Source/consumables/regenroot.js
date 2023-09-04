const ConsumableTemplate = require("../../Classes/ConsumableTemplate.js");
const { addModifier } = require("../combatantDAO.js");
const { selectSelf } = require("./selectors/selectSelf.js");

module.exports = new ConsumableTemplate("Regen Root", "Grants the user 5 Regen", selectSelf, effect)
	.setElement("Untyped")
	.setCost(30)
	.setTargetTags("self", "delver")
	.setFlavorText([]);

function effect(targets, user, isCrit, adventure) {
	// +5 Regen
	addModifier(user, { name: "Regen", stacks: 5 });
	return `${user.getName(adventure.room.enemyIdMap)} gains Regen.`;
}
