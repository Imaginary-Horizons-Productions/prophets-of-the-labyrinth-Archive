const ConsumableTemplate = require("../../Classes/ConsumableTemplate.js");
const { addModifier, getFullName } = require("../combatantDAO.js");
const { selectSelf } = require("./selectors/selectSelf.js");

module.exports = new ConsumableTemplate("Regen Root", "Grants the user 5 Regen", selectSelf, effect)
	.setElement("Untyped")
	.setTargetTags("self", "delver")
	.setFlavorText([]);

function effect(target, user, isCrit, adventure) {
	// +5 Regen
	addModifier(user, { name: "Regen", stacks: 5 });
	return `${getFullName(user, adventure.room.enemyTitles)} starts regenerating.`;
}
