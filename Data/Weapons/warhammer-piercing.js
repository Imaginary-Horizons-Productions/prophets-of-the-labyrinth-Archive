const Weapon = require('../../Classes/Weapon.js');
const { dealDamage, addModifier } = require('../combatantDAO.js');

module.exports = new Weapon("Piercing Warhammer", 1, "*Strike a foe for @{damage} (+@{bonusDamage} if foe is already stunned) unblockable @{element} damage*\nCritical Hit: Damage x@{critMultiplier}", "Earth", effect, [])
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setCost(350)
	.setUses(10)
	.setDamage(100)
	.setBonusDamage(75);

function effect(target, user, isCrit, adventure) {
	let { element: weaponElement, modifiers: [elementStagger], damage, bonusDamage, critMultiplier } = module.exports;
	if (target.modifiers.Stun) {
		damage += bonusDamage;
	}
	if (user.element === weaponElement) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		damage *= critMultiplier;
	}
	return dealDamage(target, user, damage, true, weaponElement, adventure);
}
