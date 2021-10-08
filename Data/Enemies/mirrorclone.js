const Enemy = require("../../Classes/Enemy.js");
const { takeDamage } = require("../combatantDAO.js");

module.exports = new Enemy("mirrorclone")
	.setHp(300)
	.setSpeed(100)
	.setElement("dark")
	.addActions([{ name: "glass shard", weight: 1, effect: glassShardEffect }]);

function glassShardEffect(target, user, isCrit, element, adventure) {
	let damage = 50;
	if (isCrit) {
		damage *= 2;
	}
	return takeDamage(target, damage, element, adventure);
}
