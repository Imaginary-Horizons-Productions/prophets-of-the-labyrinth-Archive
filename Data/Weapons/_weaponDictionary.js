const fs = require('fs');

var weaponWhitelist = [
	"-empty.js",
	"-punch.js",
	"backstab.js",
	"buckler.js",
	"chameleonsword.js",
	"chargingslash.js",
	"cursedshield.js",
	"dagger.js",
	"fierymedicine.js",
	"fireshield.js",
	"icespear.js",
	"preemptivestrike.js",
	"prideclaw.js",
	"shieldbash.sj",
	"shieldoflight.js"
];
const weaponFiles = fs.readdirSync('./Data/Weapons').filter(file => file.endsWith('.js') && weaponWhitelist.includes(file));
exports.weaponDictionary = {};

for (const file of weaponFiles) {
	const weapon = require(`./${file}`);
	exports.weaponDictionary[weapon.name] = weapon;
}
