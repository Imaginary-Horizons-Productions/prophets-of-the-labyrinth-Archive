const Weapon = require('../../Classes/Weapon.js');
const { dealDamage, addModifier } = require("../combatantDAO.js");

module.exports = new Weapon("Lethal Spear", 2, "*Strike a foe for @{damage} @{element} damage*\nCritical Hit: Inflict @{mod1Stacks} @{mod1} and damage x@{critBonus}", "Light", effect, ["Reactive Spear", "Sweeping Spear"])
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Stagger", stacks: 1 }])
	.setCost(350)
	.setUses(10)
	.setDamage(100);

function effect(target, user, isCrit, adventure) {
	let { element: weaponElement, modifiers: [elementStagger, critStagger], damage, critBonus } = module.exports;
	if (user.element === weaponElement) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		damage *= critBonus;
		addModifier(target, critStagger);
	}
	return dealDamage(target, user, damage, false, weaponElement, adventure);
}
