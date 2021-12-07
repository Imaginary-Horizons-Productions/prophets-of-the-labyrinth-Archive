const Weapon = require('../../Classes/Weapon.js');
const { removeModifier, addModifier } = require('../combatantDAO.js');

module.exports = new Weapon("Earthen Potion", "*Apply 4 Regen to a Earth element combatant, or 4 Poison to someone else*\nCritical Hit: Poison/Regen x@{critMultiplier}", "Earth", effect, ["Inky Potion", "Watery Potion"])
	.setTargetingTags({ target: "single", team: "any" })
	.setUses(5);

function effect(target, user, isCrit, adventure) {
	let { element: weaponElement, critMultiplier } = module.exports;
	let value = 4;
	if (isCrit) {
		value *= critMultiplier;
	}
	if (target.element === weaponElement) {
		if (user.element === weaponElement) {
			removeModifier(target, "Stagger", 1);
		}
		addModifier(target, "Regen", value);
		return;
	} else {
		if (user.element === weaponElement) {
			addModifier(target, "Stagger", 1);
		}
		addModifier(target, "Poison", value);
		return;
	}
}
