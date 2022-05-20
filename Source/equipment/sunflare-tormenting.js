const Equipment = require('../../Classes/Equipment.js');
const { addModifier } = require('../combatantDAO.js');
const { isDebuff } = require('../Modifiers/_modifierDictionary.js');

module.exports = new Equipment("Tormenting Sun Flare", 2, "*Inflict @{mod1Stacks} @{mod1} and 1 of each of a foe's debuffs on that foe (+@{speedBonus} speed bonus)*\nCritical Hit: Inflict @{mod2Stacks} @{mod2} as well", "Fire", effect, ["Evasive Sun Flare", "Swift Sun Flare"])
	.setCategory("Spell")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Stagger", stacks: 1 }, { name: "Slow", stacks: 2 }])
	.setCost(350)
	.setUses(10)
	.setSpeedBonus(5);

function effect(target, user, isCrit, adventure) {
	let { element, modifiers: [elementStagger, stagger, slow] } = module.exports;
	for (const modifier in target.modifiers) {

		if (isDebuff(modifier)) {
			addModifier(target, { name: modifier, stacks: 1 });
		}
	}
	if (user.element === element) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		addModifier(target, slow);
	}
	addModifier(target, stagger);
	return "";
}
