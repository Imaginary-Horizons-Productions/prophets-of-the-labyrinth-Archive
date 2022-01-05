const { generateRandomNumber } = require("../../helpers");

var weaponWhitelist = [
	"-punch.js",
	"barrier-base.js",
	"barrier-purifying.js",
	"barrier-thick.js",
	"barrier-urgent.js",
	"battleaxe-base.js",
	"battleaxe-prideful.js",
	"battleaxe-thick.js",
	"battleaxe-thirsting.js",
	"bloodaegis-base.js",
	"bloodaegis-charging.js",
	"bloodaegis-heavy.js",
	"bloodaegis-sweeping.js",
	"bow-base.js",
	"bow-evasive.js",
	"bow-hunters.js",
	"bow-mercurial.js",
	"buckler-base.js",
	"buckler-guarding.js",
	"buckler-heavy.js",
	"buckler-urgent.js",
	"censer-base.js",
	"cloak-base.js",
	"cloak-long.js",
	"cloak-swift.js",
	"cloak-thick.js",
	"daggers-base.js",
	"daggers-sharpened.js",
	"daggers-sweeping.js",
	"daggers-wicked.js",
	"disarm-base.js",
	"firecracker-base.js",
	"firecracker-double.js",
	"firecracker-mercurial.js",
	"firecracker-toxic.js",
	"inspire-base.js",
	"lifedrain-base.js",
	"lifedrain-reactive.js",
	"lifedrain-urgent.js",
	"potion-base.js",
	"potion-earthen.js",
	"potion-inky.js",
	"potion-watery.js",
	"scythe-base.js",
	"scythe-lethal.js",
	"scythe-toxic.js",
	"sickle-base.js",
	"sickle-hunters",
	"sickle-sharpened",
	"sickle-thick",
	"spear-base.js",
	"spear-lethal.js",
	"spear-reactive.js",
	"spear-sweeping.js",
	"sunflare-base.js",
	"sunflare-evasive.js",
	"sunflare-swift.js",
	"sunflare-tormenting.js",
	"sword-base.js",
	"sword-guarding.js",
	"sword-reckless.js",
	"sword-swift.js",
	"warhammer-base.js"
];

const allWeapons = {};
const weaponDrops = {
	Earth: {
		"0": [],
		"1": [],
		"2": []
	},
	Wind: {
		"0": [],
		"1": [],
		"2": []
	},
	Water: {
		"0": [],
		"1": [],
		"2": []
	},
	Fire: {
		"0": [],
		"1": [],
		"2": []
	},
	Light: {
		"0": [],
		"1": [],
		"2": []
	},
	Darkness: {
		"0": [],
		"1": [],
		"2": []
	},
	untyped: {
		"-1": [],
		"0": [],
		"1": [],
		"2": []
	}
};

for (const file of weaponWhitelist) {
	const weapon = require(`./${file}`);
	allWeapons[weapon.name] = weapon;
	weaponDrops[weapon.element][weapon.tier.toString()].push(weapon.name);
}

exports.getWeaponProperty = function (weaponName, propertyName) {
	if (!allWeapons[weaponName]) {
		console.error("Fetching property from illegal weapon: " + weaponName);
	} else {
		return allWeapons[weaponName][propertyName];
	}
}

exports.rollWeaponDrop = function (tier, adventure) {
	let elements = adventure.delvers.map(delver => delver.element);
	let pool = elements.reduce((pool, element) => pool.concat(weaponDrops[element][tier]), []);
	return pool[generateRandomNumber(adventure, pool.length, "general")];
}
