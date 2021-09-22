const Weapon = require('../../Classes/Weapon.js');

module.exports = new Weapon("dagger", "An attack that deals extra damage on a critical hit", "wind", (target, user, isCrit) => { })
	.setPower(10)
	.setUses(10);
