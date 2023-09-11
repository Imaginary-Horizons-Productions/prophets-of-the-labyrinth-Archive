const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { dealDamage, addModifier } = require("../combatantDAO.js");

module.exports = new EquipmentTemplate("Shortsword", "Strike a foe for @{damage} @{element} damage, then apply @{mod1Stacks} @{mod1} to both the foe and yourself", "Damage x@{critBonus}", "Fire", effect)
	.setCategory("Weapon")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setUpgrades("Accelerating Shortsword", "Toxic Shortsword")
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Exposed", stacks: 1 }])
	.setCost(200)
	.setUses(10)
	.setDamage(75);

function effect([target], user, isCrit, adventure) {
	if (target.hp < 1) {
		return ` ${target.getName(adventure.room.enemyIdMap)} was already dead!`;
	}

	let { element, modifiers: [elementStagger, exposed], damage, critBonus } = module.exports;
	if (user.element === element) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		damage *= critBonus;
	}
	addModifier(user, exposed);
	return dealDamage([target], user, damage, false, element, adventure).then(damageText => {
		addModifier(target, exposed);
		return `${damageText} ${user.getName(adventure.room.enemyIdMap)} is Exposed.`;
	});
}
