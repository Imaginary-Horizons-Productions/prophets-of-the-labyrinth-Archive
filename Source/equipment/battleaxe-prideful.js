const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { addModifier, dealDamage } = require('../combatantDAO.js');

module.exports = new EquipmentTemplate("Prideful Battleaxe", "Strike a foe for @{damage} @{element} damage, gain @{mod1Stacks} @{mod1}", "Damage x@{critBonus}", "Untyped", effect)
	.setCategory("Weapon")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setSidegrades("Thick Battleaxe", "Thirsting Battleaxe")
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Exposed", stacks: 1 }])
	.setCost(350)
	.setUses(10)
	.setDamage(175);

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
		return `${damageText} ${user.getName(adventure.room.enemyIdMap)} is Exposed.`;
	});
}
