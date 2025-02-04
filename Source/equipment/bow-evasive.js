const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { dealDamage, addModifier } = require('../combatantDAO.js');
const { needsLivingTargets } = require('../enemyDAO.js');

module.exports = new EquipmentTemplate("Evasive Bow", "Strike a foe for @{damage} @{element} damage and gain @{mod1Stacks} @{mod1} with priority", "Damage x@{critBonus}", "Wind", needsLivingTargets(effect))
	.setCategory("Weapon")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setSidegrades("Hunter's Bow", "Mercurial Bow")
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Evade", stacks: 2 }])
	.setCost(350)
	.setUses(15)
	.setDamage(75)
	.setPriority(1);

function effect([target], user, isCrit, adventure) {
	let { element, modifiers: [elementStagger, evade], damage, critBonus } = module.exports;
	if (user.element === element) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		damage *= critBonus;
	}
	addModifier(user, evade);
	return dealDamage([target], user, damage, false, element, adventure).then(damageText => {
		return `${damageText} ${user.getName(adventure.room.enemyIdMap)} is ready to Evade.`;
	});
}
