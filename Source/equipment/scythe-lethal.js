const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { addModifier, dealDamage } = require('../combatantDAO.js');

module.exports = new EquipmentTemplate("Lethal Scythe", "Strike a foe for @{damage} @{element} damage; instant death if foe is at or below @{bonus} hp", "Instant death threshold x@{critBonus}", "Wind", effect, ["Piercing Scythe", "Toxic Scythe"])
	.setCategory("Weapon")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setCost(350)
	.setUses(10)
	.setDamage(75)
	.setBonus(99) // execute threshold
	.setCritBonus(3);

function effect([target], user, isCrit, adventure) {
	if (target.hp < 1) {
		return ` ${target.getName(adventure.room.enemyIdMap)} was already dead!`;
	}

	let { element, modifiers: [elementStagger], damage, bonus: hpThreshold, critBonus } = module.exports;
	if (user.element === element) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		hpThreshold *= critBonus;
	}
	if (target.hp > hpThreshold) {
		return dealDamage([target], user, damage, false, element, adventure);
	} else {
		target.hp = 0;
		return `${target.getName(adventure.room.enemyIdMap)} meets the reaper.`;
	}
}
