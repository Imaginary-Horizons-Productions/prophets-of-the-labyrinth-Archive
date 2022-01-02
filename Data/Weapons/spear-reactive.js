const Weapon = require('../../Classes/Weapon.js');
const { dealDamage, addModifier, calculateTotalSpeed } = require("../combatantDAO.js");

module.exports = new Weapon("Reactive Spear", 2, "*Strike a foe for @{damage} (+@{bonusDamage} if foe went first) @{element} damage*\nCritical Hit: Inflict @{mod1Stacks} @{mod1}", "Light", effect, ["Lethal Spear", "Sweeping Spear"])
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Stagger", stacks: 1 }])
	.setCost(350)
	.setUses(10)
	.setDamage(100)
	.setBonusDamage(75);

function effect(target, user, isCrit, adventure) {
	let { element: weaponElement, modifiers: [elementStagger, critStagger], damage, bonusDamage } = module.exports;
	if (calculateTotalSpeed(target) > calculateTotalSpeed(user)) {
		damage += bonusDamage;
	}
	if (user.element === weaponElement) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		addModifier(target, critStagger);
	}
	return dealDamage(target, user, damage, weaponElement, adventure);
}
