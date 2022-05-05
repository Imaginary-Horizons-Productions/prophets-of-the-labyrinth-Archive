const Equipment = require('../../Classes/Equipment.js');
const { dealDamage, addModifier, calculateTotalSpeed } = require("../combatantDAO.js");

module.exports = new Equipment("Reactive Spear", 2, "*Strike a foe for @{damage} (+@{bonusDamage} if foe went first) @{element} damage*\nCritical Hit: Inflict @{mod1Stacks} @{mod1}", "Light", effect, ["Lethal Spear", "Sweeping Spear"])
	.setCategory("Weapon")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Stagger", stacks: 1 }])
	.setCost(350)
	.setUses(10)
	.setDamage(100)
	.setBonusDamage(75);

function effect(target, user, isCrit, adventure) {
	let { element, modifiers: [elementStagger, critStagger], damage, bonusDamage } = module.exports;
	if (calculateTotalSpeed(target) > calculateTotalSpeed(user)) {
		damage += bonusDamage;
	}
	if (user.element === element) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		addModifier(target, critStagger);
	}
	return dealDamage(target, user, damage, false, element, adventure);
}
