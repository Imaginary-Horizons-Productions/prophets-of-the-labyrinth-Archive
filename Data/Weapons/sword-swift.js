const Weapon = require('../../Classes/Weapon.js');
const { dealDamage, addModifier } = require('../combatantDAO.js');

module.exports = new Weapon("Swift Sword", 2, "*Strike a foe for @{damage} @{element} damage, then gain @{mod1Stacks} @{mod1} and @{mod2Stacks} @{mod2}*\nCritical Hit: Damage x@{critMultiplier}", "Earth", effect, ["Guarding Sword", "Reckless Sword"])
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "powerup", stacks: 25 }, { name: "Quicken", stacks: 2 }])
	.setCost(350)
	.setUses(10)
	.setDamage(75);

function effect(target, user, isCrit, adventure) {
	let { element: weaponElement, modifiers: [elementStagger, powerUp, quicken], damage, critMultiplier } = module.exports;
	if (user.element === weaponElement) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		damage *= critMultiplier;
	}
	addModifier(user, quicken);
	addModifier(user, powerUp);
	return dealDamage(target, user, damage, weaponElement, adventure);
}
