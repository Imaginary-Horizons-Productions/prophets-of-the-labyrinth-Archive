var weaponWhitelist = [
	"-punch.js",
	"barrier-base.js",
	"barrier-purifying.js",
	"barrier-thick.js",
	"bloodaegis-base.js",
	"bloodaegis-heavy.js",
	"bloodaegis-sweeping.js",
	"buckler-base.js",
	"buckler-guarding.js",
	"buckler-heavy.js",
	"buckler-swift.js",
	"chameleonsword.js",
	"cloak-base.js",
	"cloak-long.js",
	"cloak-swift.js",
	"cloak-thick.js",
	"dagger-base.js",
	"dagger-sharpened.js",
	"dagger-sweeping.js",
	"dagger-wicked.js",
	"firecracker-base.js",
	"firecracker-double.js",
	"firecracker-mercurial.js",
	"firecracker-toxic.js",
	"fireshield.js",
	"icespear.js",
	"lifedrain-base.js",
	"potion-base.js",
	"potion-earthen.js",
	"potion-inky.js",
	"potion-watery.js",
	"prideclaw.js",
	"shieldbash.js",
	"sickle-base.js",
	"sickle-hunters",
	"sickle-sharpened",
	"sickle-thick",
	"spear-base.js",
	"spear-lethal.js",
	"spear-reactive.js",
	"spear-sweeping.js",
	"sword-base.js",
	"sword-charging.js",
	"sword-guarding.js",
	"sword-swift.js"
];

const weaponDictionary = {};

for (const file of weaponWhitelist) {
	const weapon = require(`./${file}`);
	weaponDictionary[weapon.name] = weapon;
}

exports.getWeaponProperty = function (weaponName, propertyName) {
	return weaponDictionary[weaponName][propertyName];
}
