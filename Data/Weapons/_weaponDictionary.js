var weaponWhitelist = [
	"-punch.js",
	"backstab.js",
	"buckler.js",
	"chameleonsword.js",
	"chargingslash.js",
	"cursedshield.js",
	"dagger.js",
	"fanofknives.js",
	"fierymedicine.js",
	"firecracker.js",
	"fireshield.js",
	"icespear.js",
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
