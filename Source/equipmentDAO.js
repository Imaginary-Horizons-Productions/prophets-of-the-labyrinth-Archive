const { getEmoji, getColor } = require("./elementHelpers.js");
const { getEquipmentProperty, buildEquipmentDescription } = require("./equipment/_equipmentDictionary");
const { isBuff, isDebuff, isNonStacking } = require("./Modifiers/_modifierDictionary");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { SAFE_DELIMITER, MAX_BUTTONS_PER_ROW } = require("../constants.js");
const { ordinalSuffixEN, generateTextBar } = require("../helpers.js");

/** Seen in target selection embeds and /inspect-self equipment fields contain nearly all information about the equipment they represent
 * @param {string} equipmentName
 * @param {number} uses
 * @returns {import("discord.js").EmbedField} contents for a message embed field [heading, body]
 */
exports.equipmentToEmbedField = function (equipmentName, uses) {
	const maxUses = getEquipmentProperty(equipmentName, "maxUses");
	const usesText = uses === Infinity ? "∞ uses" : `${generateTextBar(uses, maxUses, maxUses)} ${uses}/${maxUses} uses`;
	return {
		name: `${equipmentName} ${getEmoji(getEquipmentProperty(equipmentName, "element"))} (${usesText})`,
		value: buildEquipmentDescription(equipmentName, true)
	};
}

/** Generates an object to Discord.js's specification that corresponds with a delver's in-adventure stats
 * @param {Delver} delver
 * @param {number} equipmentCapacity
 * @returns {MessageOptions}
 */
exports.inspectSelfPayload = function (delver, equipmentCapacity) {
	const embed = new EmbedBuilder().setColor(getColor(delver.element))
		.setTitle(`${delver.getName()} the ${delver.archetype}`)
		.setDescription(`HP: ${generateTextBar(delver.hp, delver.maxHp, 11)} ${delver.hp}/${delver.maxHp}\nPredicts: ${delver.predict}\nYour ${getEmoji(delver.element)} moves add 1 Stagger to enemies and remove 1 Stagger from allies.`)
		.setFooter({ text: "Imaginary Horizons Productions", iconURL: "https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png" });
	if (delver.block > 0) {
		embed.addFields({ name: "Block", value: delver.block.toString() })
	}
	for (let index = 0; index < equipmentCapacity; index++) {
		if (delver.equipment[index]) {
			embed.addFields(exports.equipmentToEmbedField(delver.equipment[index].name, delver.equipment[index].uses));
		} else {
			embed.addFields({ name: `${ordinalSuffixEN(index + 1)} Equipment Slot`, value: "No equipment yet..." })
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
				style = ButtonStyle.Primary;
			} else if (isDebuff(modifierName)) {
				style = ButtonStyle.Danger;
			} else {
				style = ButtonStyle.Secondary;
			}
			actionRow.push(new ButtonBuilder().setCustomId(`modifier${SAFE_DELIMITER}${modifierName}${SAFE_DELIMITER}${i}`)
				.setLabel(`${modifierName}${isNonStacking(modifierName) ? "" : ` x ${delver.modifiers[modifierName]}`}`)
				.setStyle(style))
		}
		if (modifiers.length > 4) {
			actionRow.push(new ButtonBuilder().setCustomId(`modifier${SAFE_DELIMITER}MORE`)
				.setLabel(`${modifiers.length - 4} more...`)
				.setStyle(ButtonStyle.Secondary)
				.setDisabled(delver.predict !== "Modifiers"))
		}
		components.push(new ActionRowBuilder().addComponents(...actionRow));
	}
	return { embeds: [embed], components, ephemeral: true };
}
