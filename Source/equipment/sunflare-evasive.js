const Equipment = require('../../Classes/Equipment.js');
const { addModifier } = require('../combatantDAO.js');

module.exports = new Equipment("Evasive Sun Flare", 2, "*Inflict @{mod1Stacks} @{mod1} on a foe and gain @{mod2Stacks} @{mod2} (+@{speedBonus} speed bonus)*\nCritical Hit: Inflict @{mod3Stacks} @{mod3} as well", "Fire", effect, ["Swift Sun Flare", "Tormenting Sun Flare"])
	.setCategory("Spell")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Stagger", stacks: 1 }, { name: "Evade", stacks: 2 }, { name: "Slow", stacks: 2 }])
	.setCost(350)
	.setUses(10)
	.setSpeedBonus(5)
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
