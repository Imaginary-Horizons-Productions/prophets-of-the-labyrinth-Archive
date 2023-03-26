const ConsumableTemplate = require("../../Classes/ConsumableTemplate.js");
const { addModifier, getFullName } = require("../combatantDAO.js");
const { selectSelf } = require("./selectors/selectSelf.js");

module.exports = new ConsumableTemplate("Stasis Quartz", "Grants the user 1 Stasis", selectSelf, effect)
	.setElement("Untyped")
	.setTargetTags("self", "delver")
	.setFlavorText([]);

function effect(target, user, isCrit, adventure) {
	// +1 Stasis
	addModifier(user, { name: "Stasis", stacks: 1 });
	return `${getFullName(user, adventure.room.enemyTitles)} gains Stasis.`;
}
