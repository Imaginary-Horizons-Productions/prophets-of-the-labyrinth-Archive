const Weapon = require('../../Classes/Weapon.js');
const { dealDamage, addModifier } = require("../combatantDAO.js");

module.exports = new Weapon("Sweeping Spear", 2, "*Strike all foes for @{damage} @{element} damage*\nCritical Hit: Inflict 1 Stagger", "Light", effect, ["Lethal Spear", "Reactive Spear"])
	.setTargetingTags({ target: "all", team: "enemy" })
	.setCost(350)
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
