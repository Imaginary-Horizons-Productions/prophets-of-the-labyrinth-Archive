const Enemy = require("../../Classes/Enemy.js");
const { dealDamage } = require("../combatantDAO.js");

module.exports = new Enemy("brute")
	.setHp(500)
	.setSpeed(105)
	.setElement("earth")
	.addActions([{ name: "punch", weight: 3, effect: punchEffect }, { name: "big punch", weight: 1, effect: bigPunchEffect }]);

function punchEffect(target, user, isCrit, element, adventure) {
	let damage = 50;
	if (isCrit) {
		damage *= 2;
	}
	return dealDamage(target, damage, element, adventure);
}

function bigPunchEffect(target, user, isCrit, element, adventure) {
	let damage = 100;
	if (isCrit) {
		damage *= 2;
	}
	return dealDamage(target, damage, element, adventure);
}
