const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { addModifier } = require('../combatantDAO.js');

module.exports = new EquipmentTemplate("Accelerating Sun Flare", 2, "*Inflict @{mod1Stacks} @{mod1} on a foe, then gain @{mod2Stacks} @{mod2} with priority*\nCritical Hit: Inflict @{mod3Stacks} @{mod3} as well", "Fire", effect, ["Evasive Sun Flare", "Tormenting Sun Flare"])
	.setCategory("Spell")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Stagger", stacks: 1 }, { name: "Quicken", stacks: 1 }, { name: "Slow", stacks: 2 }])
	.setCost(350)
	.setUses(10)
	.markPriority();

function effect(target, user, isCrit, adventure) {
	let { element, modifiers: [elementStagger, stagger, quicken, slow] } = module.exports;
	if (user.element === element) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		addModifier(target, slow);
	}
	addModifier(target, stagger);
	addModifier(user, quicken);
	return "";
}
