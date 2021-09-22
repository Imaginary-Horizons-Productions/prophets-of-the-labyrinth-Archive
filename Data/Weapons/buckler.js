const Weapon = require('../../Classes/Weapon.js');

module.exports = new Weapon("buckler", "An attack that deals extra damage on a critical hit", "earth", (target, user, isCrit) => { })
	.setPower(10)
	.setUses(10);
