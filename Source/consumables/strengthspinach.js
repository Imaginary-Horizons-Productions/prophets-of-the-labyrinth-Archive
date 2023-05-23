const ConsumableTemplate = require("../../Classes/ConsumableTemplate.js");
const { addModifier, getFullName } = require("../combatantDAO.js");
const { selectSelf } = require("./selectors/selectSelf.js");

module.exports = new ConsumableTemplate("Strength Spinach", "Grants the user 50 Power Up", selectSelf, effect)
	.setElement("Untyped")
	.setTargetTags("self", "delver")
	.setFlavorText([]);

function effect(targets, user, isCrit, adventure) {
	// +50 Power Up
	addModifier(user, { name: "Power Up", stacks: 50 });
	return `${getFullName(user, adventure.room.enemyTitles)} gains Power Up.`;
}
