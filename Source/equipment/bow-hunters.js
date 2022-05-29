const Equipment = require('../../Classes/Equipment.js');
const { dealDamage, addModifier } = require('../combatantDAO.js');

module.exports = new Equipment("Hunter's Bow", 2, "*Strike a foe for @{damage} @{element} damage (+@{speedBonus} speed bonus), gain @{bonusDamage}g on kill*\nCritical Hit: Damage x@{critBonus}", "Wind", effect, ["Evasive Bow", "Mercurial Bow"])
	.setCategory("Weapon")
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setCost(350)
	.setUses(10)
	.setDamage(75)
	.setBonusDamage(15)
	.setSpeedBonus(10);

function effect(target, user, isCrit, adventure) {
	let { element, modifiers: [elementStagger], damage, bonusDamage: bonusBounty, critBonus } = module.exports;
	if (user.element === element) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		damage *= critBonus;
	}
	return dealDamage(target, user, damage, false, element, adventure).then(damageText => {
		if (target.hp < 1) {
			adventure.gainGold(bonusBounty);
			damageText += ` ${getFullName(user, adventure.room.enemyTitles)} harvests ${bonusBounty}g of alchemical reagents.`;
		}
		return damageText;
	});
}
