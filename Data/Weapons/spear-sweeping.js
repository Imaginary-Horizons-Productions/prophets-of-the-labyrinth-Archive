const Weapon = require('../../Classes/Weapon.js');
const { dealDamage, addModifier } = require("../combatantDAO.js");

module.exports = new Weapon("Sweeping Spear", "*Strike all foes for @{damage} @{element} damage*\nCritical Hit: Inflict 1 Stagger", "Light", effect, [])
	.setTargetingTags({ target: "all", team: "enemy" })
	.setUses(10)
	.setDamage(75);

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
