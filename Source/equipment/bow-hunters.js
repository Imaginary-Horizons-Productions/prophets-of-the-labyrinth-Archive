const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { dealDamage, addModifier } = require('../combatantDAO.js');

module.exports = new EquipmentTemplate("Hunter's Bow", "Strike a foe for @{damage} @{element} damage with priority, gain @{bonus}g on kill", "Damage x@{critBonus}", "Wind", effect, ["Evasive Bow", "Mercurial Bow"])
	.setCategory("Weapon")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setCost(350)
	.setUses(10)
	.setDamage(75)
	.setBonus(15) // gold
	.markPriority();

function effect([target], user, isCrit, adventure) {
	if (target.hp < 1) {
		return ` ${target.getName(adventure.room.enemyIdMap)} was already dead!`;
	}

	let { element, modifiers: [elementStagger], damage, bonus: bonusBounty, critBonus } = module.exports;
	if (user.element === element) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		damage *= critBonus;
	}
	return dealDamage(target, user, damage, false, element, adventure).then(damageText => {
		if (target.hp < 1) {
			adventure.gainGold(bonusBounty);
			damageText += ` ${user.getName(adventure.room.enemyIdMap)} forages ${bonusBounty}g of hunting trophies.`;
		}
		return damageText;
	});
}
