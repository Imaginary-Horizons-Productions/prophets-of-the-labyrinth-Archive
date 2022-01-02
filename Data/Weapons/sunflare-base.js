const Weapon = require('../../Classes/Weapon.js');
const { addModifier } = require('../combatantDAO.js');

module.exports = new Weapon("Spell: Sun Flare", 1, "*Inflict @{mod1Stacks} @{mod1} on a foe (+@{speedBonus} speed)*\nCritical Hit: Inflict @{mod2Stacks} @{mod2} as well\n", "Light", effect, ["Spell: Evasive Sun Flare", "Spell: Swift Sun Flare", "Spell: Tormenting Sun Flare"])
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Stagger", stacks: 2 }, { name: "Slow", stacks: 2 }])
	.setCost(200)
	.setUses(10)
	.setSpeedBonus(5);

function effect(target, user, isCrit, adventure) {
	let { element: weaponElement, modifiers: [elementStagger, stagger, slow] } = module.exports;
	if (user.element === weaponElement) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		addModifier(target, slow);
	}
	addModifier(target, stagger);
	return "";
}
