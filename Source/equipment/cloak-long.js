const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { addModifier, removeModifier } = require('../combatantDAO.js');

module.exports = new EquipmentTemplate("Long Cloak", "*Gain @{mod1Stacks} @{mod1}*\nCritical Hit💥: Gain @{mod2Stacks} @{mod2}", "Wind", effect, ["Accelerating Cloak", "Thick Cloak"])
	.setCategory("Armor")
	.setTargetingTags({ target: "self", team: "self" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Evade", stacks: 3 }, { name: "Evade", stacks: 4 }])
	.setCost(350)
	.setUses(10);

function effect(targets, user, isCrit, adventure) {
	let { element, modifiers: [elementStagger, evade, critEvade] } = module.exports;
	if (user.element === element) {
		removeModifier(user, elementStagger);
	}
	if (isCrit) {
		addModifier(user, critEvade);
	} else {
		addModifier(user, evade);
	}
	return ""; // result as text
}
