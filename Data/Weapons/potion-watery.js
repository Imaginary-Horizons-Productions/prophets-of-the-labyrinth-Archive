const Weapon = require('../../Classes/Weapon.js');
const { removeModifier, addModifier } = require('../combatantDAO.js');

module.exports = new Weapon("Watery Potion", 2, "*Apply @{mod1Stacks} @{mod1} to a Water element combatant, or @{mod2Stacks} @{mod2} to someone else*\nCritical Hit: @{mod1}/@{mod2} x@{critMultiplier}", "Water", effect, ["Earthen Potion", "Inky Potion"])
	.setTargetingTags({ target: "single", team: "any" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Regen", stacks: 4 }, { name: "Poison", stacks: 4 }, { name: "Regen", stacks: 8 }, { name: "Poison", stacks: 8 }])
	.setCost(350)
	.setUses(5);

function effect(target, user, isCrit, adventure) {
	let { element: weaponElement, modifiers: [elementStagger, regen, poison, critRegen, critPoison] } = module.exports;
	if (target.element === weaponElement) {
		if (user.element === weaponElement) {
			removeModifier(target, elementStagger);
		}
		if (isCrit) {
			addModifier(target, regen);
		} else {
			addModifier(target, critRegen);
		}
		return;
	} else {
		if (user.element === weaponElement) {
			addModifier(target, elementStagger);
		}
		if (isCrit) {
			addModifier(target, critPoison);
		} else {
			addModifier(target, poison);
		}
		return;
	}
}
