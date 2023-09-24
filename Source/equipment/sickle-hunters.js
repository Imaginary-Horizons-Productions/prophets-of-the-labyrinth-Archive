const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { addModifier, dealDamage } = require('../combatantDAO.js');
const { needsLivingTargets } = require('../enemyDAO.js');

module.exports = new EquipmentTemplate("Hunter's Sickle", "Strike a foe for @{damage} (+5% foe max hp) @{element} damage, gain @{bonus}g on kill", "Damage x@{critBonus}", "Water", needsLivingTargets(effect))
	.setCategory("Weapon")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setSidegrades("Sharpened Sickle", "Toxic Sickle")
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setCost(350)
	.setUses(15)
	.setDamage(75)
	.setBonus(15); // gold

function effect([target], user, isCrit, adventure) {
	let { element, modifiers: [elementStagger], damage, critBonus, bonus: bonusBounty } = module.exports;
	damage += (0.05 * target.maxHp);
	if (user.element === element) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		damage *= critBonus;
	}
	return dealDamage([target], user, damage, false, element, adventure).then(damageText => {
		if (target.hp < 1) {
			adventure.gainGold(bonusBounty);
			damageText += ` ${user.getName(adventure.room.enemyIdMap)} harvests ${bonusBounty}g of alchemical reagents.`;
		}
		return damageText;
	});
}
