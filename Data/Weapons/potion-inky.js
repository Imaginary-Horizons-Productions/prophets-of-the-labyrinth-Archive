const Weapon = require('../../Classes/Weapon.js');
const { removeModifier, addModifier } = require('../combatantDAO.js');

module.exports = new Weapon("Inky Potion", 2, "*Apply 4 Regen to a Darkness element combatant, or 4 Poison to someone else*\nCritical Hit: Poison/Regen x@{critMultiplier}", "Darkness", effect, ["Earthen Potion", "Watery Potion"])
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
