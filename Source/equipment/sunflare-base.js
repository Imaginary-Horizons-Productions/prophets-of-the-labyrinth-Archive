const Equipment = require('../../Classes/Equipment.js');
const { addModifier } = require('../combatantDAO.js');

module.exports = new Equipment("Sun Flare", 1, "*Inflict @{mod1Stacks} @{mod1} on a foe (+@{speedBonus} speed bonus)*\nCritical Hit: Inflict @{mod2Stacks} @{mod2} as well", "Light", effect, ["Evasive Sun Flare", "Swift Sun Flare", "Tormenting Sun Flare"])
	.setCategory("Spell")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Stagger", stacks: 1 }, { name: "Slow", stacks: 2 }])
	.setCost(200)
	.setUses(10)
	.setSpeedBonus(5);

function effect(target, user, isCrit, adventure) {
	let { element, modifiers: [elementStagger, stagger, slow] } = module.exports;
	if (user.element === element) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		addModifier(target, slow);
	}
	addModifier(target, stagger);
	return "";
}
