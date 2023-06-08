const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { addModifier, dealDamage } = require('../combatantDAO.js');

module.exports = new EquipmentTemplate("Toxic Scythe", "Strike a foe applying @{mod1Stacks} @{mod1} and @{damage} @{element} damage; instant death if foe is at or below @{bonus} hp", "Instant death threshold x@{critBonus}", "Wind", effect, ["Lethal Scythe", "Piercing Scythe"])
	.setCategory("Weapon")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Poison", stacks: 3 }])
	.setCost(350)
	.setUses(10)
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
	addModifier(target, poison);
	if (target.hp > hpThreshold) {
		return dealDamage(target, user, damage, false, element, adventure);
	} else {
		target.hp = 0;
		return `${target.getName(adventure.room.enemyIdMap)} meets the reaper.`;
	}
}
