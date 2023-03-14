const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { addModifier } = require('../combatantDAO.js');

module.exports = new EquipmentTemplate("Evasive Sun Flare", "*Inflict @{mod1Stacks} @{mod1} on a foe and gain @{mod2Stacks} @{mod2} with priority*\nCritical Hit💥: Inflict @{mod3Stacks} @{mod3} as well", "Fire", effect, ["Accelerating Sun Flare", "Tormenting Sun Flare"])
	.setCategory("Spell")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Stagger", stacks: 1 }, { name: "Evade", stacks: 2 }, { name: "Slow", stacks: 2 }])
	.setCost(350)
	.setUses(10)
	.markPriority()
	.setBlock(50);

function effect(target, user, isCrit, adventure) {
	let { element, modifiers: [elementStagger, stagger, evade, slow] } = module.exports;
	if (user.element === element) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		addModifier(target, slow);
	}
	addModifier(target, stagger);
	addModifier(user, evade);
	return "";
}
