const Weapon = require('../../Classes/Weapon.js');
const { dealDamage, addModifier } = require("../combatantDAO.js");

module.exports = new Weapon("Wicked Daggers", 2, "*Strike a foe for @{damage} (+@{bonusDamage} if foe has 0 block) @{element} damage*\nCritical Hit: Damage x@{critMultiplier}", "Wind", effect, ["Sharpened Daggers", "Sweeping Daggers"])
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setCost(350)
	.setUses(10)
	.setCritMultiplier(3)
	.setDamage(75)
	.setBonusDamage(50);

function effect(target, user, isCrit, adventure) {
	let { element: weaponElement, modifiers: [elementStagger], damage, bonusDamage, critMultiplier } = module.exports;
	if (target.block === 0) {
		damage += bonusDamage;
	}
	if (user.element === weaponElement) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		damage *= critMultiplier;
	}
	return dealDamage(target, user, damage, false, weaponElement, adventure);
}
