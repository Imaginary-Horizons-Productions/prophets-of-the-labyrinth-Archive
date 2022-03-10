const Weapon = require('../../Classes/Weapon.js');
const { dealDamage, addModifier } = require('../combatantDAO.js');

module.exports = new Weapon("Reckless Sword", 2, "*Strike a foe for @{damage} (+@{bonusDamage} if you have 0 block) @{element} damage and gain @{mod1Stacks} @{mod1}*\nCritical Hit: Damage x@{critBonus}", "Earth", effect, ["Guarding Sword", "Swift Sword"])
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Power Up", stacks: 25 }])
	.setCost(350)
	.setUses(10)
	.setDamage(75)
	.setBonusDamage(75);

function effect(target, user, isCrit, adventure) {
	let { element: weaponElement, modifiers: [elementStagger, powerUp], damage, bonusDamage, critBonus } = module.exports;
	if (user.element === weaponElement) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		damage *= critBonus;
	}
	if (user.block === 0) {
		damage += bonusDamage;
	}
	addModifier(user, powerUp);
	return dealDamage(target, user, damage, false, weaponElement, adventure);
}
