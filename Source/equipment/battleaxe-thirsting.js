const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { addModifier, dealDamage, gainHealth } = require('../combatantDAO.js');

module.exports = new EquipmentTemplate("Thirsting Battleaxe", "Strike a foe for @{damage} @{element} damage, gain @{mod1Stacks} @{mod1}; heal @{healing} hp on kill", "Damage x@{critBonus}", "Fire", effect)
	.setCategory("Weapon")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setSidegrades("Prideful Battleaxe", "Thick Battleaxe")
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Exposed", stacks: 1 }])
	.setCost(350)
	.setUses(15)
	.setDamage(125)
	.setHealing(60);

function effect([target], user, isCrit, adventure) {
	if (target.hp < 1) {
		return ` ${target.getName(adventure.room.enemyIdMap)} was already dead!`;
	}

	let { element, modifiers: [elementStagger, exposed], damage, critBonus, healing } = module.exports;
	if (user.element === element) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		damage *= critBonus;
	}
	addModifier(user, exposed);
	return dealDamage([target], user, damage, false, element, adventure).then(damageText => {
		if (target.hp < 1) {
			damageText += gainHealth(user, healing, adventure);
		}
		return `${damageText} ${user.getName(adventure.room.enemyIdMap)} is Exposed.`;
	});
}
