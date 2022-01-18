const Weapon = require('../../Classes/Weapon.js');
const { addModifier, dealDamage } = require('../combatantDAO.js');

module.exports = new Weapon("Prideful Battleaxe", 2, "Strike a foe for @{damage} (+@{bonusDamage} if you have 0 block) @{element} damage*\nCritical Hit: Damage x@{critBonus}", "untyped", effect, ["Thick Battleaxe", "Thirsting Battleaxe"])
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setCost(350)
	.setUses(10)
	.setDamage(100)
	.setBonusDamage(100);

function effect(target, user, isCrit, adventure) {
	let { element: weaponElement, modifiers: [elementStagger], damage, bonusDamage, critBonus } = module.exports;
	if (user.block === 0) {
		damage += bonusDamage;
	}
	if (user.element === weaponElement) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		damage *= critBonus;
	}
	return dealDamage(target, user, damage, false, weaponElement, adventure);
}
