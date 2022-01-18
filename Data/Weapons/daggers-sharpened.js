const Weapon = require('../../Classes/Weapon.js');
const { addModifier, dealDamage } = require("../combatantDAO.js");

module.exports = new Weapon("Sharpened Daggers", 2, "*Strike a foe for @{damage} @{element} damage*\nCritical Hit: Damage x@{critMultiplier}", "Wind", effect, ["Sweeping Daggers", "Wicked Daggers"])
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setCost(350)
	.setUses(10)
	.setCritMultiplier(3)
	.setDamage(100);

function effect(target, user, isCrit, adventure) {
	let { element: weaponElement, modifiers: [elementStagger], damage, critMultiplier } = module.exports;
	if (user.element === weaponElement) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		damage *= critMultiplier;
	}
	return dealDamage(target, user, damage, false, weaponElement, adventure);
}
