let generateRandomNumber;
exports.injectConfig = function (isProduction) {
	({ generateRandomNumber } = require("../../helpers.js").injectConfig(isProduction));
	return this;
}
const { getEmoji } = require("../elementHelpers.js");

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
	"disarm-flanking.js",
	"firecracker-base.js",
	"firecracker-double.js",
	"firecracker-mercurial.js",
	"firecracker-toxic.js",
	"infiniteregeneration-base.js",
	"inspiration-base.js",
	"inspiration-soothing.js",
	"inspiration-sweeping.js",
	"lifedrain-base.js",
	"lifedrain-flanking.js",
	"lifedrain-reactive.js",
	"lifedrain-urgent.js",
	"midasstaff-base.js",
	"midasstaff-soothing.js",
	"midasstaff-swift.js",
	"potion-base.js",
	"potion-earthen.js",
	"potion-inky.js",
	"potion-watery.js",
	"scythe-base.js",
	"scythe-lethal.js",
	"scythe-piercing.js",
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
	"warhammer-base.js",
	"warhammer-piercing.js"
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
	Untyped: {
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

exports.buildWeaponDescription = function (weaponName, buildFullDescription) {
	let description = exports.getWeaponProperty(weaponName, "description").replace("@{element}", getEmoji(exports.getWeaponProperty(weaponName, "element")))
		.replace("@{critBonus}", exports.getWeaponProperty(weaponName, "critBonus"))
		.replace("@{damage}", exports.getWeaponProperty(weaponName, "damage"))
		.replace("@{bonusDamage}", exports.getWeaponProperty(weaponName, "bonusDamage"))
		.replace("@{block}", exports.getWeaponProperty(weaponName, "block"))
		.replace("@{hpCost}", exports.getWeaponProperty(weaponName, "hpCost"))
		.replace("@{healing}", exports.getWeaponProperty(weaponName, "healing"))
		.replace("@{speedBonus}", exports.getWeaponProperty(weaponName, "speedBonus"));
	exports.getWeaponProperty(weaponName, "modifiers").forEach((modifier, index) => {
		description = description.replace(new RegExp(`@{mod${index}}`, "g"), modifier.name)
			.replace(new RegExp(`@{mod${index}Stacks}`, "g"), modifier.stacks);
	})

	if (buildFullDescription) {
		// return the base and crit effects of the weapon with the base italicized
		return description;
	} else {
		// return the base effect of the weapon unitalicized
		return description.split("\n")[0].replace(/\*/g, "");
	}
}

exports.rollWeaponDrop = function (tier, adventure) {
	let elements = adventure.delvers.map(delver => delver.element);
	let pool = elements.reduce((pool, element) => pool.concat(weaponDrops[element][tier]), []);
	return pool[generateRandomNumber(adventure, pool.length, "general")];
}
