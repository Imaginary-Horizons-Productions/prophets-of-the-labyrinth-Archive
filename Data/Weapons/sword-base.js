const Weapon = require('../../Classes/Weapon.js');
const { dealDamage, addModifier } = require('../combatantDAO.js');

module.exports = new Weapon("Sword", 1, "*Strike a foe for @{damage} @{element} damage and gain @{mod1Stacks} @{mod1}*\nCritical Hit: Damage x@{critMultiplier}", "Earth", effect, ["Guarding Sword", "Reckless Sword", "Swift Sword"])
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "powerup", stacks: 25 }])
	.setCost(200)
	.setUses(5)
	.setDamage(75);

function effect(target, user, isCrit, adventure) {
	let { element: weaponElement, modifiers: [elementStagger, powerUp], damage, critMultiplier } = module.exports;
	if (user.element === weaponElement) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		damage *= critMultiplier;
	}
	addModifier(user, powerUp);
	return dealDamage(target, user, damage, weaponElement, adventure);
}
