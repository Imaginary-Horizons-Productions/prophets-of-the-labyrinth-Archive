const { getEmoji, getColor } = require("./elementHelpers.js");
const { getEquipmentProperty, buildEquipmentDescription } = require("./equipment/_equipmentDictionary");
const { isBuff, isDebuff, isNonStacking } = require("./Modifiers/_modifierDictionary");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { SAFE_DELIMITER, MAX_BUTTONS_PER_ROW } = require("../constants.js");
const { ordinalSuffixEN } = require("../helpers.js");
const { getFullName } = require("./combatantDAO.js");

/** Seen in target selection embeds and /inspect-self equipment fields contain nearly all information about the equipment they represent
 * @param {string} equipmentName
 * @param {number} uses
 * @returns {string[2]} contents for a message embed field [heading, body]
 */
exports.equipmentToEmbedField = function (equipmentName, uses) {
	const usesText = uses === Infinity ? "∞ uses" : `${uses}/${getEquipmentProperty(equipmentName, "maxUses")} uses`;
	return [
		`${equipmentName} ${getEmoji(getEquipmentProperty(equipmentName, "element"))} (${usesText})`,
		buildEquipmentDescription(equipmentName, true)
	];
}

/** Generates an object to Discord.js's specification that corresponds with a delver's in-adventure stats
 * @param {Delver} delver
 * @param {number} equipmentCapacity
 * @returns {MessageOptions}
 */
exports.delverStatsPayload = function (delver, equipmentCapacity) {
	let embed = new MessageEmbed().setColor(getColor(delver.element))
		.setTitle(getFullName(delver, {}))
		.setDescription(`HP: ${delver.hp}/${delver.maxHp}\nPredicts: ${delver.predict}\nYour ${getEmoji(delver.element)} moves add 1 Stagger to enemies and remove 1 Stagger from allies.`)
		.setFooter({ text: "Imaginary Horizons Productions", iconURL: "https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png" });
	if (delver.block > 0) {
		embed.addField("Block", delver.block.toString())
	}
	for (let index = 0; index < equipmentCapacity; index++) {
		if (delver.equipment[index]) {
			embed.addField(...exports.equipmentToEmbedField(delver.equipment[index].name, delver.equipment[index].uses));
		} else {
			embed.addField(`${ordinalSuffixEN(index + 1)} Equipment Slot`, "No equipment yet...")
		}
	}
	let components = [];
	if (Object.keys(delver.modifiers).length) {
		let actionRow = [];
		let modifiers = Object.keys(delver.modifiers);
		let buttonCount = Math.min(modifiers.length, MAX_BUTTONS_PER_ROW - 1); // save spot for "and X more..." button
		for (let i = 0; i < buttonCount; i++) {
			let modifierName = modifiers[i];
			let style;
			if (isBuff(modifierName)) {
				style = "PRIMARY";
			} else if (isDebuff(modifierName)) {
				style = "DANGER";
			} else {
				style = "SECONDARY";
			}
			actionRow.push(new MessageButton().setCustomId(`modifier${SAFE_DELIMITER}${modifierName}${SAFE_DELIMITER}${i}`)
				.setLabel(`${modifierName}${isNonStacking(modifierName) ? "" : ` x ${delver.modifiers[modifierName]}`}`)
				.setStyle(style))
		}
		if (modifiers.length > 4) {
			actionRow.push(new MessageButton().setCustomId(`modifier${SAFE_DELIMITER}MORE`)
				.setLabel(`${modifiers.length - 4} more...`)
				.setStyle("SECONDARY")
				.setDisabled(delver.predict !== "Modifiers"))
		}
		components.push(new MessageActionRow().addComponents(...actionRow));
	}
	return { embeds: [embed], components, ephemeral: true };
}
