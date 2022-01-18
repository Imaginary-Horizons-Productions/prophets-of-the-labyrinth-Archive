const Weapon = require('../../Classes/Weapon.js');
const { dealDamage, addModifier } = require('../combatantDAO.js');

module.exports = new Weapon("Evasive Bow", 2, "*Strike a foe for @{damage} @{element} damage and gain @{mod1Stacks} @{mod1} (+@{speedBonus})*\nCritical Hit: Damage x@{critBonus}", "Wind", effect, ["Hunter's Bow", "Mercurial Bow"])
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Evade", stacks: 1 }])
	.setCost(350)
	.setUses(10)
	.setDamage(75)
	.setSpeedBonus(10);

function effect(target, user, isCrit, adventure) {
	let { element: weaponElement, modifiers: [elementStagger, evade], damage, critBonus } = module.exports;
	if (user.element === weaponElement) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		damage *= critBonus;
	}
	addModifier(user, evade);
	return dealDamage(target, user, damage, false, weaponElement, adventure);
}
