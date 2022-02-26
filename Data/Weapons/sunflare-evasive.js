const Weapon = require('../../Classes/Weapon.js');
const { addModifier } = require('../combatantDAO.js');

module.exports = new Weapon("Spell: Evasive Sun Flare", 2, "*Inflict @{mod1Stacks} @{mod1} on a foe and gain @{mod2Stacks} @{mod2} (+@{speedBonus} speed)*\nCritical Hit: Inflict @{mod3Stacks} @{mod3} as well", "Fire", effect, ["Spell: Swift Sun Flare", "Spell: Tormenting Sun Flare"])
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Stagger", stacks: 1 }, { name: "Evade", stacks: 2 }, { name: "Slow", stacks: 2 }])
	.setCost(350)
	.setUses(10)
	.setSpeedBonus(5)
	.setBlock(50);

function effect(target, user, isCrit, adventure) {
	let { element: weaponElement, modifiers: [elementStagger, stagger, evade, slow] } = module.exports;
	if (user.element === weaponElement) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		addModifier(target, slow);
	}
	addModifier(target, stagger);
	addModifier(user, evade);
	return "";
}
