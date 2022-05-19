const Enemy = require("../../Classes/Enemy.js");
const { dealDamage, addModifier } = require("../combatantDAO.js");
const { selectRandomFoe, nextRepeat } = require("../enemyDAO.js");

module.exports = new Enemy("Bloodtail Hawk")
	.setFirstAction("Rake")
	.addAction({ name: "Rake", effect: rakeEffect, selector: selectRandomFoe, next: nextRepeat })
	.setBounty(25)
	.setHp(200)
	.setSpeed(105)
	.setElement("Wind")
	.setStaggerThreshold(1)
	.setCritDenominator(3);

function rakeEffect(target, user, isCrit, adventure) {
	let damage = 50;
	if (isCrit) {
		damage *= 2;
	}
	addModifier(target, { name: "Stagger", stacks: 1 });
	return dealDamage(target, user, damage, false, user.element, adventure);
}
