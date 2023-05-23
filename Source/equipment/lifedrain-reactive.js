const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { addModifier, dealDamage, gainHealth, calculateTotalSpeed, getFullName } = require('../combatantDAO.js');

module.exports = new EquipmentTemplate("Reactive Life Drain", "*Strike a foe for @{damage} (+@{bonusDamage} if foe went first) @{element} damage, then gain @{healing} hp*\nCritical Hit💥: Healing x@{critBonus}", "Water", effect, ["Flanking Life Drain", "Urgent Life Drain"])
	.setCategory("Spell")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setCost(350)
	.setUses(10)
	.setDamage(75)
	.setHealing(25)
	.setBonusDamage(50);

async function effect([target], user, isCrit, adventure) {
	if (target.hp < 1) {
		return ` ${getFullName(target, adventure.room.enemyTitles)} was already dead!`;
	}

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
