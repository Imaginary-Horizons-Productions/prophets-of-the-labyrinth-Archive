const Weapon = require('../../Classes/Weapon.js');
const { addModifier } = require('../combatantDAO.js');

module.exports = new Weapon("Unfinished Potion", 1, "Apply 4 Poison to a foe*\nCritical Hit: Poison x@{critMultiplier}", "Water", effect, ["Earthen Potion", "Inky Potion", "Watery Potion"])
	.setTargetingTags({ target: "single", team: "enemy" })
	.setUses(5);

function effect(target, user, isCrit, adventure) {
	let { element: weaponElement, critMultiplier } = module.exports;
	let value = 4;
	if (user.element === weaponElement) {
		addModifier(target, "Stagger", 1);
	}
	if (isCrit) {
		value *= critMultiplier;
	}
	addModifier(target, "Poison", value);
	return "";
}
