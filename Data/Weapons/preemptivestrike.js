const Weapon = require('../../Classes/Weapon.js');
const { takeDamage } = require('../combatantDAO.js');

module.exports = new Weapon("preemptivestrike", "Deal more damage if the target has lower speed than you (crit: gain block)", "water", effect)
	.setUses(10);

function effect(target, user, isCrit, element, adventure) {
	let damage = 50;
	let block = 0;
	if (target.speed + target.roundSpeed < user.speed + user.roundSpeed) {
		damage += 100;
	}
	if (isCrit) {
		block += 75;
	}
	user.addBlock(block);
	return takeDamage(target, damage, element, adventure);
}
