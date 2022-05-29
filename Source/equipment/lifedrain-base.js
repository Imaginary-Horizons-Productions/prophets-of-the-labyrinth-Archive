const Equipment = require('../../Classes/Equipment.js');
const { addModifier, dealDamage, gainHealth } = require('../combatantDAO.js');

module.exports = new Equipment("Life Drain", 1, "*Strike a foe for @{damage} @{element} damage, then gain @{healing} hp*\nCritical Hit: Healing x@{critBonus}", "Water", effect, ["Flanking Life Drain", "Reactive Life Drain", "Urgent Life Drain"])
	.setCategory("Spell")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setCost(200)
	.setUses(10)
	.setDamage(75)
	.setHealing(25);

async function effect(target, user, isCrit, adventure) {
	let { element, modifiers: [elementStagger], damage, healing, critBonus } = module.exports;
	if (user.element === element) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		healing *= critBonus;
	}
	return `${await dealDamage(target, user, damage, false, element, adventure)} ${gainHealth(user, healing, adventure)}`;
}
