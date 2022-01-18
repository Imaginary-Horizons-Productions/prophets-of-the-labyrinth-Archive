const Weapon = require('../../Classes/Weapon.js');
const { addModifier, dealDamage } = require('../combatantDAO.js');

module.exports = new Weapon("Sickle", 1, "*Strike a foe for @{damage} (+10% foe max hp) @{element} damage*\nCritical Hit: Damage x@{critBonus}", "Water", effect, ["Hunter's Sickle", "Sharpened Sickle", "Thick Sickle"])
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setCost(200)
	.setUses(10)
	.setDamage(75);

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
