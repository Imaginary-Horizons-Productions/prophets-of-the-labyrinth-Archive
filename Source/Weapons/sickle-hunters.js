const Weapon = require('../../Classes/Weapon.js');
const { addModifier, dealDamage, getFullName } = require('../combatantDAO.js');

module.exports = new Weapon("Hunter's Sickle", 2, "*Strike a foe for @{damage} (+10% foe max hp) @{element} damage, gain @{bonusDamage}g on kill*\nCritical Hit: Damage x@{critBonus}", "Water", effect, ["Sharpened Sickle", "Thick Sickle"])
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setCost(350)
	.setUses(10)
	.setDamage(75)
	.setBonusDamage(15);

function effect(target, user, isCrit, adventure) {
	let { element: weaponElement, modifiers: [elementStagger], damage, critBonus, bonusDamage: bonusBounty } = module.exports;
	damage += (0.1 * target.maxHp);
	if (user.element === weaponElement) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		damage *= critBonus;
	}
	return dealDamage(target, user, damage, false, weaponElement, adventure).then(damageText => {
		if (target.hp < 1) {
			adventure.gainGold(bonusBounty);
			damageText += ` ${getFullName(user, adventure.room.enemyTitles)} harvests ${bonusBounty}g of alchemical reagents.`;
		}
		return damageText;
	});
}
