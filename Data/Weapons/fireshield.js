const Weapon = require('../../Classes/Weapon.js');
const { takeDamage, addBlock } = require("../combatantDAO.js");

module.exports = new Weapon("fireshield", "Defend yourself while bashing a target with a flaming shield (crit: more damage)", "fire", effect)
	.setTargetingTags({ target: "single", team: "enemy" })
	.setUses(5);

function effect(target, user, isCrit, element, adventure) {
	let damage = 75;
	let block = 50;
	if (user.element === element) {
		damage *= 1.5;
	}
	if (isCrit) {
		damage *= 2;
	}
	addBlock(user, block);
	return takeDamage(target, damage, element, adventure);
}
