const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { addModifier, removeModifier } = require('../combatantDAO.js');

module.exports = new EquipmentTemplate("Accelerating Cloak", 2, "*Gain @{mod1Stacks} @{mod1} and @{mod2Stacks} @{mod2}*\nCritical Hit: Gain @{mod3Stacks} @{mod3} and @{mod4Stacks} @{mod4}", "Wind", effect, ["Long Cloak", "Thick Cloak"])
	.setCategory("Armor")
	.setTargetingTags({ target: "self", team: "self" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Evade", stacks: 2 }, { name: "Quicken", stacks: 1 }, { name: "Evade", stacks: 3 }, { name: "Quicken", stacks: 2 }])
	.setCost(350)
	.setUses(10);

function effect(target, user, isCrit, adventure) {
	let { element, modifiers: [elementStagger, evade, quicken, critEvade, critQuicken] } = module.exports;
	if (user.element === element) {
		removeModifier(user, elementStagger);
	}
	if (isCrit) {
		addModifier(user, critEvade);
		addModifier(user, critQuicken);
	} else {
		addModifier(user, evade);
		addModifier(user, quicken);
	}
	return "";
}
