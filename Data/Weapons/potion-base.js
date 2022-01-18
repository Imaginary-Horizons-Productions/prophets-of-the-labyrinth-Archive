const Weapon = require('../../Classes/Weapon.js');
const { addModifier } = require('../combatantDAO.js');

module.exports = new Weapon("Unfinished Potion", 1, "*Apply @{mod1Stacks} @{mod1} to a foe*\nCritical Hit: @{mod1} x@{critBonus}", "Water", effect, ["Earthen Potion", "Inky Potion", "Watery Potion"])
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Poison", stacks: 4 }, { name: "Poison", stacks: 8 }])
	.setCost(200)
	.setUses(5);

function effect(target, user, isCrit, adventure) {
	let { element: weaponElement, modifiers: [elementStagger, poison, critPoison] } = module.exports;
	if (user.element === weaponElement) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		addModifier(target, critPoison);
	} else {
		addModifier(target, poison);
	}
	return "";
}
