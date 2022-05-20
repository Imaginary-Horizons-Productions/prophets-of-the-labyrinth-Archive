const Equipment = require('../../Classes/Equipment.js');
const { addModifier, dealDamage, gainHealth, calculateTotalSpeed } = require('../combatantDAO.js');

module.exports = new Equipment("Reactive Life Drain", 2, "*Strike a foe for @{damage} (+@{bonusDamage} if foe went first) @{element} damage, then gain @{healing} hp*\nCritical Hit: Healing x@{critBonus}", "Water", effect, ["Flanking Life Drain", "Urgent Life Drain"])
	.setCategory("Spell")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setCost(350)
	.setUses(10)
	.setDamage(75)
	.setHealing(25)
	.setBonusDamage(50);

async function effect(target, user, isCrit, adventure) {
	let { element, modifiers: [elementStagger], damage, bonusDamage, healing, critBonus } = module.exports;
	if (calculateTotalSpeed(target) > calculateTotalSpeed(user)) {
		damage += bonusDamage;
	}
	if (user.element === element) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		healing *= critBonus;
	}
	return `${await dealDamage(target, user, damage, false, element, adventure)} ${gainHealth(user, healing, adventure)}`;
}
