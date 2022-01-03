const Weapon = require('../../Classes/Weapon.js');
const { dealDamage, addModifier } = require("../combatantDAO.js");

module.exports = new Weapon("Daggers", 1, "*Strike a foe for @{damage} @{element} damage*\nCritical Hit: Damage x@{critMultiplier}", "Wind", effect, ["Sharpened Daggers", "Sweeping Daggers", "Wicked Daggers"])
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setCost(200)
	.setUses(10)
	.setDamage(75)
	.setCritMultiplier(3);

function effect(target, user, isCrit, adventure) {
	let { element: weaponElement, modifiers: [elementStagger], damage, critMultiplier } = module.exports;
	if (user.element === weaponElement) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		damage *= critMultiplier;
	}
	return dealDamage(target, user, damage, weaponElement, adventure);
}
