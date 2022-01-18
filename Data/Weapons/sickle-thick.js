const Weapon = require('../../Classes/Weapon.js');
const { addModifier, dealDamage } = require('../combatantDAO.js');

module.exports = new Weapon("Thick Sickle", 2, "*Strike a foe for @{damage} (+10% foe max hp) @{element} damage*\nCritical Hit: Damage x@{critBonus}", "Water", effect, ["Hunter's Sickle", "Sharpened Sickle"])
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setCost(350)
	.setUses(20)
	.setDamage(75);

function effect(target, user, isCrit, adventure) {
	let { element: weaponElement, modifiers: [elementStagger], damage, critBonus } = module.exports;
	damage += (0.1 * target.maxHp);
	if (user.element === weaponElement) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		damage *= critBonus;
	}
	return dealDamage(target, user, damage, false, weaponElement, adventure);
}
