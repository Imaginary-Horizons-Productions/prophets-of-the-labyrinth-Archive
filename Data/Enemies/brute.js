const Enemy = require("../../Classes/Enemy.js");
const { takeDamage } = require("../combatantDAO.js");

module.exports = new Enemy("brute")
	.setHp(20)
	.setSpeed(5)
	.setElement("earth")
	.addActions([{ name: "punch", weight: 3, effect: punchEffect }, { name: "big punch", weight: 1, effect: bigPunchEffect }]);

function punchEffect(target, user, isCrit, element, adventure) {
	let damage = 5;
	if (isCrit) {
		damage *= 2;
	}
	return takeDamage(target, damage, element, adventure);
}

function bigPunchEffect(target, user, isCrit, element, adventure) {
	let damage = 10;
	if (isCrit) {
		damage *= 2;
	}
	return takeDamage(target, damage, element, adventure);
}
