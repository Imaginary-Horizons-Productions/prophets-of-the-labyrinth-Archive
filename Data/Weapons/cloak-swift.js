const Weapon = require('../../Classes/Weapon.js');
const { addModifier, removeModifier } = require('../combatantDAO.js');

module.exports = new Weapon("Swift Cloak", 2, "*Gain @{mod1Stacks} @{mod1} and @{mod2Stacks} @{mod2}*\nCritical Hit: Gain @{mod3Stacks} @{mod3} and @{mod4Stacks} @{mod4}", "Wind", effect, ["Long Cloak", "Thick Cloak"])
	.setTargetingTags({ target: "self", team: "self" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "evade", stacks: 1 }, { name: "Quicken", stacks: 2 }, { name: "evade", stacks: 3 }, { name: "Quicken", stacks: 3 }])
	.setCost(350)
	.setUses(5);

function effect(target, user, isCrit, adventure) {
	let { element: weaponElement, modifiers: [elementStagger, evade, quicken, critEvade, critQuicken] } = module.exports;
	if (user.element === weaponElement) {
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
