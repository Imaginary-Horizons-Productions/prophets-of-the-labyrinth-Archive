const Weapon = require('../../Classes/Weapon.js');
const { addModifier, dealDamage, getFullName } = require('../combatantDAO.js');

module.exports = new Weapon("Hunter's Sickle", 2, "*Strike a foe for @{damage} (+10% foe max hp) @{element} damage, gain @{bonusDamage}g on kill*\nCritical Hit: Damage x@{critMultiplier}", "Water", effect, ["Sharpened Sickle", "Thick Sickle"])
	.setTargetingTags({ target: "single", team: "enemy" })
	.setUses(10)
	.setDamage(75)
	.setBonusDamage(15);

function effect(target, user, isCrit, adventure) {
	let { element: weaponElement, damage, critMultiplier, bonusDamage: bonusBounty } = module.exports;
	damage += (0.1 * target.maxHp);
	if (user.element === weaponElement) {
		addModifier(target, "Stagger", 1);
	}
	if (isCrit) {
		damage *= critMultiplier;
	}
	return dealDamage(target, user, damage, weaponElement, adventure).then(damageText => {
		if (target.hp < 1) {
			adventure.gainGold(bonusBounty);
			damageText += ` ${getFullName(user, adventure.room.enemyTitles)} harvests ${bonusBounty}g of alchemical reagents.`;
		}
		return damageText;
	});
}
