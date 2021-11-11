const Enemy = require("../../Classes/Enemy.js");
const { dealDamage, addModifier } = require("../combatantDAO.js");

module.exports = new Enemy("brute")
	.setHp(500)
	.setSpeed(105)
	.setElement("Earth")
	.setStaggerThreshold(3)
	.addAction({ name: "punch", weight: 3, effect: punchEffect })
	.addAction({ name: "big punch", weight: 1, effect: bigPunchEffect });

function punchEffect(target, user, isCrit, element, adventure) {
	let damage = 50;
	if (isCrit) {
		damage *= 2;
	}
	addModifier(target, "Stagger", 1);
	return dealDamage(target, user, damage, element, adventure);
}

function bigPunchEffect(target, user, isCrit, element, adventure) {
	let damage = 100;
	if (isCrit) {
		damage *= 2;
	}
	addModifier(target, "Stagger", 3);
	return dealDamage(target, user, damage, element, adventure);
}
