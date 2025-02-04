const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { dealDamage, addModifier } = require('../combatantDAO.js');
const { SAFE_DELIMITER } = require("../../constants.js");
const { needsLivingTargets } = require('../enemyDAO.js');

module.exports = new EquipmentTemplate("Mercurial Firecracker", "Strike 3 random foes for @{damage} damage matching the user's element", "Damage x@{critBonus}", "Fire", needsLivingTargets(effect))
	.setCategory("Weapon")
	.setTargetingTags({ target: `random${SAFE_DELIMITER}3`, team: "enemy" })
	.setSidegrades("Double Firecracker", "Toxic Firecracker")
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setCost(350)
	.setUses(15)
	.setCritBonus(2)
	.setDamage(50);

function effect(targets, user, isCrit, adventure) {
	let { element, modifiers: [elementStagger], damage, critBonus } = module.exports;
	if (isCrit) {
		damage *= critBonus;
	}
	return Promise.all(
		targets.map(target => {
			if (user.element === element) {
				addModifier(target, elementStagger);
			}
			return dealDamage([target], user, damage, false, user.element, adventure);
		})
	).then(results => results.filter(result => Boolean(result)).join(" "));
}
