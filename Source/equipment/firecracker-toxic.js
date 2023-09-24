const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { dealDamage, addModifier } = require('../combatantDAO.js');
const { SAFE_DELIMITER } = require("../../constants.js");
const { needsLivingTargets } = require('../enemyDAO.js');

module.exports = new EquipmentTemplate("Toxic Firecracker", "Strike 3 random foes applying @{mod1Stacks} @{mod1} and @{damage} @{element} damage", "Damage x@{critBonus}", "Fire", needsLivingTargets(effect))
	.setCategory("Weapon")
	.setTargetingTags({ target: `random${SAFE_DELIMITER}3`, team: "enemy" })
	.setSidegrades("Double Firecracker", "Mercurial Firecracker")
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Poison", stacks: 3 }])
	.setCost(350)
	.setUses(15)
	.setCritBonus(2)
	.setDamage(50);

function effect(targets, user, isCrit, adventure) {
	let { element, modifiers: [elementStagger, poison], damage, critBonus } = module.exports;
	if (isCrit) {
		damage *= critBonus;
	}
	return Promise.all(
		targets.map(target => {
			if (user.element === element) {
				addModifier(target, elementStagger);
			}
			addModifier(target, poison);
			return dealDamage([target], user, damage, false, element, adventure).then(damageText => {
				return `${damageText} ${target.getName(adventure.room.enemyIdMap)} is Poisoned.`;
			});
		})
	).then(results => results.filter(result => Boolean(result)).join(" "));
}
