var weaponWhitelist = [
	"-punch.js",
	"buckler-base.js",
	"buckler-guarding.js",
	"buckler-heavy.js",
	"chameleonsword.js",
	"chargingslash.js",
	"cloak.js",
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
	"potion-fiery.js",
	"potion-luminous.js",
	"potion-windy.js",
	"preemptivestrike.js",
	"prideclaw.js",
	"shieldbash.js",
	"shieldoflight.js"
];

const weaponDictionary = {};

for (const file of weaponWhitelist) {
	const weapon = require(`./${file}`);
	weaponDictionary[weapon.name] = weapon;
}

exports.getWeapon = (weaponName) => {
	return weaponDictionary[weaponName];
}
