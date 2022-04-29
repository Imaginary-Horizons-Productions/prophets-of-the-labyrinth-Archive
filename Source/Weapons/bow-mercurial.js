const Weapon = require('../../Classes/Weapon.js');
const { dealDamage, addModifier } = require('../combatantDAO.js');

module.exports = new Weapon("Mercurial Bow", 2, "*Strike a foe for @{damage} damage matching the user's element (+@{speedBonus} speed bonus)*\nCritical Hit: Damage x@{critBonus}", "Wind", effect, ["Evasive Bow", "Hunter's Bow"])
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setCost(350)
	.setUses(10)
	.setDamage(75)
	.setSpeedBonus(10);

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
