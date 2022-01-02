const Weapon = require('../../Classes/Weapon.js');
const { addModifier, dealDamage } = require('../combatantDAO.js');

module.exports = new Weapon("Sharpened Sickle", 2, "*Strike a foe for @{damage} (+10% foe max hp) @{element} damage*\nCritical Hit: Damage x@{critMultiplier}", "Water", effect, ["Hunter's Sickle", "Thick Sickle"])
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setCost(350)
	.setUses(10)
	.setDamage(125);

function effect(target, user, isCrit, adventure) {
	let { element: weaponElement, modifiers: [elementStagger], damage, critMultiplier } = module.exports;
	damage += (0.1 * target.maxHp);
	if (user.element === weaponElement) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		damage *= critMultiplier;
	}
	return dealDamage(target, user, damage, weaponElement, adventure);
}
