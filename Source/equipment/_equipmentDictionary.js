const { getEmoji } = require("../elementHelpers.js");

const EQUIPMENT = {};

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
	"buckler-devoted.js",
	"buckler-guarding.js",
	"buckler-heavy.js",
	"censer-base.js",
	"censer-fatesealing.js",
	"censer-thick.js",
	"censer-tormenting.js",
	"certainvictory-base.js",
	"certainvictory-hunters.js",
	"certainvictory-lethal.js",
	"certainvictory-reckless.js",
	"cloak-base.js",
	"cloak-long.js",
	"cloak-accelerating.js",
	"cloak-thick.js",
	"corrosion-base.js",
	"corrosion-flanking.js",
	"daggers-base.js",
	"daggers-sharpened.js",
	"daggers-slowing.js",
	"daggers-sweeping.js",
	"firecracker-base.js",
	"firecracker-double.js",
	"firecracker-mercurial.js",
	"firecracker-toxic.js",
	"floatingmiststance-base.js",
	"infiniteregeneration-base.js",
	"infiniteregeneration-fatesealing.js",
	"inspiration-base.js",
	"inspiration-reinforcing.js",
	"inspiration-soothing.js",
	"inspiration-sweeping.js",
	"ironfiststance-base.js",
	"ironfiststance-organic.js",
	"lance-accelerating.js",
	"lance-base.js",
	"lance-piercing.js",
	"lance-vigilant.js",
	"lifedrain-base.js",
	"lifedrain-flanking.js",
	"lifedrain-reactive.js",
	"lifedrain-urgent.js",
	"midasstaff-base.js",
	"midasstaff-soothing.js",
	"midasstaff-accelerating.js",
	"potionkit-base.js",
	"potionkit-guarding.js",
	"potionkit-organic.js",
	"potionkit-urgent.js",
	"scutum-base.js",
	"scutum-heavy.js",
	"scutum-sweeping.js",
	"scutum-vigilant.js",
	"scythe-base.js",
	"scythe-lethal.js",
	"scythe-piercing.js",
	"scythe-toxic.js",
	"shortsword-accelerating.js",
	"shortsword-base.js",
	"shortsword-toxic.js",
	"sickle-base.js",
	"sickle-hunters",
	"sickle-sharpened",
	"sickle-toxic",
	"spear-base.js",
	"spear-lethal.js",
	"spear-reactive.js",
	"spear-sweeping.js",
	"sunflare-base.js",
	"sunflare-evasive.js",
	"sunflare-accelerating.js",
	"sunflare-tormenting.js",
	"vigilancecharm-base.js",
	"vigilancecharm-devoted.js",
	"vigilancecharm-long.js",
	"vigilancecharm-guarding.js",
	"warcry-base.js",
	"warcry-charging.js",
	"warcry-slowing.js",
	"warcry-tormenting.js",
	"warhammer-base.js",
	"warhammer-piercing.js",
	"warhammer-slowing.js"
]) {
	const equip = require(`./${file}`);
	if (equip.name in EQUIPMENT) {
		console.error(`Equipment overwritten due to same name: ${equip.name}`);
	}
	EQUIPMENT[equip.name] = equip;
};

exports.equipNames = Object.keys(EQUIPMENT);

/** Checks if a type of equipment with the given name exists
 * @param {string} equipmentName
 * @returns {boolean}
 */
exports.equipmentExists = function (equipmentName) {
	return equipmentName in EQUIPMENT;
}

/** Lookup a static property for a type of equipment
 * @param {string} equipmentName
 * @param {string} propertyName
 * @returns {any}
 */
exports.getEquipmentProperty = function (equipmentName, propertyName) {
	if (exports.equipmentExists(equipmentName)) {
		const template = EQUIPMENT[equipmentName];
		if (propertyName in template) {
			return template[propertyName];
		} else {
			console.error(`Property ${propertyName} not found on ${equipmentName}`);
		}
	} else {
		console.error(`Equipment name ${equipmentName} not recognized`);
	}
}

exports.buildEquipmentDescription = function (equipmentName, buildFullDescription) {
	if (exports.equipmentExists(equipmentName)) {
		let description;
		if (buildFullDescription) {
			// return the base and crit effects of the equipment with the base italicized
			description = `*Effect:* ${exports.getEquipmentProperty(equipmentName, "description")}\n*Critical💥:* ${exports.getEquipmentProperty(equipmentName, "critDescription")}`;
		} else {
			// return the base effect of the equipment unitalicized
			description = exports.getEquipmentProperty(equipmentName, "description");
		}

		description = description.replace("@{element}", getEmoji(exports.getEquipmentProperty(equipmentName, "element")))
			.replace("@{critBonus}", exports.getEquipmentProperty(equipmentName, "critBonus"))
			.replace("@{damage}", exports.getEquipmentProperty(equipmentName, "damage"))
			.replace("@{bonus}", exports.getEquipmentProperty(equipmentName, "bonus"))
			.replace("@{block}", exports.getEquipmentProperty(equipmentName, "block"))
			.replace("@{hpCost}", exports.getEquipmentProperty(equipmentName, "hpCost"))
			.replace("@{healing}", exports.getEquipmentProperty(equipmentName, "healing"));
		exports.getEquipmentProperty(equipmentName, "modifiers").forEach((modifier, index) => {
			description = description.replace(new RegExp(`@{mod${index}}`, "g"), modifier.name)
				.replace(new RegExp(`@{mod${index}Stacks}`, "g"), modifier.stacks);
		})
		return description;
	}
}
