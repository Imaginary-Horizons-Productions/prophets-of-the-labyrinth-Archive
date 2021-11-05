var weaponWhitelist = [
	"-punch.js",
	"barrier-base.js",
	"barrier-thick.js",
	"buckler-base.js",
	"buckler-guarding.js",
	"buckler-heavy.js",
	"buckler-swift.js",
	"chameleonsword.js",
	"chargingslash.js",
	"cloak-base.js",
	"cloak-long.js",
	"cloak-swift.js",
	"cloak-thick.js",
	"crystalsword.js",
	"cursedshield.js",
	"dagger-base.js",
	"dagger-sharpened.js",
	"dagger-sweeping.js",
	"dagger-wicked.js",
	"firecracker.js",
	"fireshield.js",
	"icespear.js",
	"potion-base.js",
	"potion-earthen.js",
	"potion-inky.js",
	"potion-watery.js",
	"prideclaw.js",
	"shieldbash.js",
	"spear-base.js",
	"spear-reactive.js",
	"spear-sweeping.js",
	"spear-wicked.js"
];

const weaponDictionary = {};

for (const file of weaponWhitelist) {
	const weapon = require(`./${file}`);
	weaponDictionary[weapon.name] = weapon;
}

exports.getWeapon = (weaponName) => {
	return weaponDictionary[weaponName];
}
