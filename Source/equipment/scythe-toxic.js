const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { addModifier, dealDamage } = require('../combatantDAO.js');

module.exports = new EquipmentTemplate("Toxic Scythe", "Strike a foe applying @{mod1Stacks} @{mod1} and @{damage} @{element} damage; instant death if foe is at or below @{bonus} hp", "Instant death threshold x@{critBonus}", "Wind", effect)
	.setCategory("Weapon")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setSidegrades("Lethal Scythe", "Piercing Scythe")
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Poison", stacks: 3 }])
	.setCost(350)
	.setUses(15)
	.setDamage(75)
	.setBonus(99); // execute threshold

function effect([target], user, isCrit, adventure) {
	if (target.hp < 1) {
		return ` ${target.getName(adventure.room.enemyIdMap)} was already dead!`;
	}

	let { element, modifiers: [elementStagger, poison], damage, bonus: hpThreshold, critBonus } = module.exports;
	if (user.element === element) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		hpThreshold *= critBonus;
	}
	if (target.hp > hpThreshold) {
		addModifier(target, poison);
		return dealDamage([target], user, damage, false, element, adventure).then(damageText => {
			return `${damageText} ${target.getName(adventure.room.enemyIdMap)} is Poisoned.`;
		});
	} else {
		target.hp = 0;
		return `${target.getName(adventure.room.enemyIdMap)} meets the reaper.`;
	}
}
