const Weapon = require('../../Classes/Weapon.js');

module.exports = new Weapon("Spell: Sweeping Blood Aegis", "*Pay @{hpCost} hp to grant all allies @{block} block*\nCritical Hit: Block x@{critMultiplier}", "Darkness", effect, [])
	.setTargetingTags({ target: "all", team: "ally" })
	.setUses(10)
	.setHpCost(25)
	.setBlock(100);

function effect(target, user, isCrit, adventure) {
	let { element: weaponElement, block, critMultiplier, hpCost } = module.exports;
	if (user.element === weaponElement) {
		removeModifier(target, "Stagger", 1);
	}
	if (isCrit) {
		block *= critMultiplier;
	}
	addBlock(target, block);
	return dealDamage(user, null, hpCost, "untyped", adventure); // user pays health
}
