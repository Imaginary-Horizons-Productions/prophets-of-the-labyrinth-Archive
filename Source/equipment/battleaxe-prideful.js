const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { addModifier, dealDamage } = require('../combatantDAO.js');
const { needsLivingTargets } = require('../enemyDAO.js');

module.exports = new EquipmentTemplate("Prideful Battleaxe", "Strike a foe for @{damage} @{element} damage, gain @{mod1Stacks} @{mod1}", "Damage x@{critBonus}", "Untyped", needsLivingTargets(effect))
	.setCategory("Weapon")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setSidegrades("Thick Battleaxe", "Thirsting Battleaxe")
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Exposed", stacks: 1 }])
	.setCost(350)
	.setUses(15)
	.setDamage(175);

function effect([target], user, isCrit, adventure) {
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
