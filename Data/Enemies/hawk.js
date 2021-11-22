const Enemy = require("../../Classes/Enemy.js");
const { dealDamage, addModifier } = require("../combatantDAO.js");

module.exports = new Enemy("Bloodtail Hawk")
	.setHp(200)
	.setSpeed(105)
	.setElement("Wind")
	.setStaggerThreshold(1)
	.addAction({ name: "Rake", weight: 3, effect: rakeEffect })
	.setBounty(25);

function rakeEffect(target, user, isCrit, adventure) {
	let damage = 50;
	if (isCrit) {
		damage *= 2;
	}
	addModifier(target, "Stagger", 1);
	return dealDamage(target, user, damage, module.exports.element, adventure);
}
