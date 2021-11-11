const Enemy = require("../../Classes/Enemy.js");
const { dealDamage, addModifier } = require("../combatantDAO.js");

module.exports = new Enemy("mirrorclone")
	.setHp(300)
	.setSpeed(100)
	.setElement("Darkness")
	.setStaggerThreshold(3)
	.addAction({ name: "glass shard", weight: 1, effect: glassShardEffect });

function glassShardEffect(target, user, isCrit, element, adventure) {
	let damage = 50;
	if (isCrit) {
		damage *= 2;
	}
	addModifier(target, "Stagger", 1);
	return dealDamage(target, user, damage, element, adventure).then(damageText => {
		return damageText;
	});;
}
