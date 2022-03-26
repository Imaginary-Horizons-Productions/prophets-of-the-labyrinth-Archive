const Weapon = require('../../Classes/Weapon.js');
const { addModifier } = require('../combatantDAO.js');

module.exports = new Weapon("Flanking Disarm", 2, "*Inflict @{mod1Stacks} @{mod1} and @{mod2Stacks} @{mod2} on a foe*\nCritical Hit: Inflict @{mod3Stacks} @{mod3} as well", "Light", effect, [])
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Power Down", stacks: 40 }, { name: "Exposed", stacks: 2 }, { name: "Stagger", stacks: 1 }])
	.setCost(350)
	.setUses(10);

function effect(target, user, isCrit, adventure) {
	let { element: weaponElement, modifiers: [elementStagger, powerDown, exposed, critStagger] } = module.exports;
	if (user.element === weaponElement) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		addModifier(target, critStagger);
	}
	addModifier(target, powerDown);
	addModifier(target, exposed);
	return ""; // result text
}
