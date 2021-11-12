const Weapon = require('../../Classes/Weapon.js');
const { dealDamage, addModifier } = require("../combatantDAO.js");

module.exports = new Weapon("Spear", "*Strike a foe for @{damage} @{element} damage*\nCritical Hit: Inflict 1 Stagger", "Light", effect, ["Lethal Spear", "Reactive Spear", "Sweeping Spear"])
	.setTargetingTags({ target: "single", team: "enemy" })
	.setUses(10)
	.setDamage(100);

function effect(target, user, isCrit, adventure) {
	let { element: weaponElement, damage } = module.exports;
	if (user.element === weaponElement) {
		addModifier(target, "Stagger", 1);
	}
	if (isCrit) {
		addModifier(target, "Stagger", 1);
	}
	return dealDamage(target, user, damage, weaponElement, adventure);
}
