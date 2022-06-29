const { generateRandomNumber } = require("../../helpers.js");
const { getEmoji } = require("../elementHelpers.js");

const allEquipment = {};
const equipmentDrops = {
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
	Untyped: {
		"-1": [],
		"0": [],
		"1": [],
		"2": []
	}
};

for (const file of [
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
	"corrosion-base.js",
	"corrosion-flanking.js",
	"daggers-base.js",
	"daggers-sharpened.js",
	"daggers-sweeping.js",
	"daggers-wicked.js",
	"firecracker-base.js",
	"firecracker-double.js",
	"firecracker-mercurial.js",
	"firecracker-toxic.js",
	"iceward-base.js",
	"iceward-heavy.js",
	"iceward-sweeping.js",
	"infiniteregeneration-base.js",
	"inspiration-base.js",
	"inspiration-reinforcing.js",
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
	"potion-watery.js",
	"potion-windy.js",
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
	"vigilancecharm-base.js",
	"vigilancecharm-devoted.js",
	"vigilancecharm-long.js",
	"vigilancecharm-guarding.js",
	"warhammer-base.js",
	"warhammer-piercing.js"
]) {
	const equip = require(`./${file}`);
	allEquipment[equip.name] = equip;
	equipmentDrops[equip.element][equip.tier.toString()].push(equip.name);
}

/** Checks if a type of equipment with the given name exists
 * @param {string} equipmentName
 * @returns {boolean}
 */
exports.equipmentExists = function (equipmentName) {
	return equipmentName in allEquipment;
}

/** Fetch a single default property from an existing type of equipment
 * @param {string} equipmentName
 * @param {string} propertyName
 * @returns
 */
exports.getEquipmentProperty = function (equipmentName, propertyName) {
	if (exports.equipmentExists(equipmentName)) {
		return allEquipment[equipmentName][propertyName];
	} else {
		console.error("Fetching property from illegal equipment: " + equipmentName);
	}
}

exports.buildEquipmentDescription = function (equipmentName, buildFullDescription) {
	if (exports.equipmentExists(equipmentName)) {
		let description = exports.getEquipmentProperty(equipmentName, "description").replace("@{element}", getEmoji(exports.getEquipmentProperty(equipmentName, "element")))
			.replace("@{critBonus}", exports.getEquipmentProperty(equipmentName, "critBonus"))
			.replace("@{damage}", exports.getEquipmentProperty(equipmentName, "damage"))
			.replace("@{bonusDamage}", exports.getEquipmentProperty(equipmentName, "bonusDamage"))
			.replace("@{block}", exports.getEquipmentProperty(equipmentName, "block"))
			.replace("@{hpCost}", exports.getEquipmentProperty(equipmentName, "hpCost"))
			.replace("@{healing}", exports.getEquipmentProperty(equipmentName, "healing"))
			.replace("@{speedBonus}", exports.getEquipmentProperty(equipmentName, "speedBonus"));
		exports.getEquipmentProperty(equipmentName, "modifiers").forEach((modifier, index) => {
			description = description.replace(new RegExp(`@{mod${index}}`, "g"), modifier.name)
				.replace(new RegExp(`@{mod${index}Stacks}`, "g"), modifier.stacks);
		})

		if (buildFullDescription) {
			// return the base and crit effects of the equipment with the base italicized
			return description;
		} else {
			// return the base effect of the equipment unitalicized
			return description.split("\n")[0].replace(/\*/g, "");
		}
	}
}

exports.rollEquipmentDrop = function (tier, adventure) {
	let elements = adventure.delvers.map(delver => delver.element);
	let pool = elements.reduce((pool, element) => pool.concat(equipmentDrops[element][tier]), []);
	return pool[generateRandomNumber(adventure, pool.length, "general")];
}
