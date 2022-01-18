const Weapon = require('../../Classes/Weapon.js');
const { dealDamage, addModifier } = require('../combatantDAO.js');

module.exports = new Weapon("Double Firecracker", 2, "*Strike 6 random foes for @{damage} @{element} damage*\nCritical Hit: Damage x@{critBonus}", "Fire", effect, ["Mercurial Firecracker", "Toxic Firecracker"])
	.setTargetingTags({ target: "random-6", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setCost(350)
	.setUses(5)
	.setCritBonus(2)
	.setDamage(50);

function effect(target, user, isCrit, adventure) {
	let { element: weaponElement, modifiers: [elementStagger], damage, critBonus } = module.exports;
	if (user.element === weaponElement) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		damage *= critBonus;
	}
	return dealDamage(target, user, damage, false, weaponElement, adventure);
}
