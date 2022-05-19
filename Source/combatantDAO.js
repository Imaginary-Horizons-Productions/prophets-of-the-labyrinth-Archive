const Enemy = require("../Classes/Enemy.js");
const Delver = require("../Classes/Delver.js");
const { getInverse, isNonStacking, getModifierDescription, isBuff, isDebuff } = require("./Modifiers/_modifierDictionary.js");
const { getWeaknesses, getResistances } = require("./elementHelpers.js");

exports.getFullName = function (combatant, titleObject) {
	if (combatant instanceof Enemy) {
		if (titleObject[combatant.name] > 1) {
			return `${combatant.name} ${combatant.title}`;
		} else {
			return combatant.name;
		}
	} else if (combatant instanceof Delver) {
		return `${combatant.name} the ${combatant.title}`;
	}
}

exports.calculateTotalSpeed = function (combatant) {
	let totalSpeed = combatant.speed + combatant.roundSpeed + combatant.actionSpeed;
	if ("Slow" in combatant.modifiers) {
		totalSpeed -= 10;
	}
	if ("Quicken" in combatant.modifiers) {
		totalSpeed += 10;
	}
	return Math.ceil(totalSpeed);
}

/** Generates an object to Discord.js's specification that corresponds with a delver's in-adventure stats
 * @param {Delver} delver
 * @param {number} equipmentCapacity
 * @returns {MessageOptions}
 */
exports.delverStatsPayload = function (delver, equipmentCapacity) {
	let embed = new MessageEmbed().setColor(getColor(delver.element))
		.setTitle(exports.getFullName(delver, {}))
		.setDescription(`HP: ${delver.hp}/${delver.maxHp}\nPredicts: ${delver.predict}\nYour ${getEmoji(delver.element)} moves add 1 Stagger to enemies and remove 1 Stagger from allies.`)
		.setFooter({ text: "Imaginary Horizons Productions", iconURL: "https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png" });
	for (let index = 0; index < equipmentCapacity; index++) {
		if (delver.equipment[index]) {
			embed.addField(...equipmentToEmbedField(delver.equipment[index].name, delver.equipment[index].uses));
		} else {
			embed.addField(`${ordinalSuffixEN(index + 1)} Equipment Slot`, "No equipment yet...")
		}
	}
	let components = [];
	if (Object.keys(delver.modifiers).length) {
		let actionRow = [];
		let modifiers = Object.keys(delver.modifiers);
		let buttonCount = Math.min(modifiers.length, 4); // 5 buttons per row, save 1 spot for "and X more..." button
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
				.setDisabled(delver.predict !== "Health"))
		}
		components.push(new MessageActionRow().addComponents(...actionRow));
	}
	return { embeds: [embed], components, ephemeral: true };
}

exports.dealDamage = async function (target, user, damage, isUnblockable, element, adventure) {
	let targetName = exports.getFullName(target, adventure.room.enemyTitles);
	let targetModifiers = Object.keys(target.modifiers);
	if (!targetModifiers.includes(`${element} Absorb`)) {
		if (!targetModifiers.includes("Evade") || isUnblockable) {
			let limitBreak = user?.modifiers["Power Up"] || 0;
			let pendingDamage = damage + limitBreak;
			if (targetModifiers.includes("Exposed")) {
				pendingDamage *= 1.5;
			}
			let isWeakness = getWeaknesses(target.element).includes(element);
			if (isWeakness) {
				pendingDamage *= 2;
			}
			let isResistance = getResistances(target.element).includes(element);
			if (isResistance) {
				pendingDamage = pendingDamage / 2;
			}
			pendingDamage = Math.ceil(pendingDamage);
			let blockedDamage = 0;
			if (!isUnblockable) {
				if (pendingDamage >= target.block) {
					pendingDamage -= target.block;
					blockedDamage = target.block;
					target.block = 0;
				} else {
					target.block -= pendingDamage;
					blockedDamage = pendingDamage;
					pendingDamage = 0;
				}
			}
			let damageCap = 500 + limitBreak;
			pendingDamage = Math.min(pendingDamage, damageCap);
			target.hp -= pendingDamage;
			let damageText = ` ${targetName} takes *${pendingDamage} damage*${blockedDamage > 0 ? ` (${blockedDamage} blocked)` : ""}${element === "Poison" ? " from Poison" : ""}${isWeakness ? "!!!" : isResistance ? "." : "!"}`;
			if (element !== "Poison" && targetModifiers.includes("Curse of Midas")) {
				adventure.room.resources.gold.count += Math.floor(pendingDamage / 10);
				damageText += ` Gold scatters about the room.`;
			}
			if (target.hp <= 0) {
				if (target.team === "delver") {
					target.hp = target.maxHp;
					adventure.lives -= 1;
					damageText += ` *${targetName} has died* and been revived. ***${adventure.lives} lives remain.***`;
				} else {
					target.hp = 0;
					damageText += ` *${targetName} has died*.`;
				}
			}
			return damageText;
		} else {
			target.modifiers["Evade"]--;
			if (target.modifiers["Evade"] <= 0) {
				delete target.modifiers["Evade"];
			}
			return ` ${targetName} evades the attack!`;
		}
	} else {
		return ` ${exports.gainHealth(target, damage, adventure)}`;
	}
}

exports.gainHealth = function (combatant, healing, adventure, inCombat = true) {
	combatant.hp += healing;
	let excessHealing = 0;
	let bloodshieldSwordCount = adventure.getArtifactCount("Bloodshield Sword");
	if (combatant.hp > combatant.maxHp) {
		excessHealing = combatant.hp - combatant.maxHp;
		combatant.hp = combatant.maxHp;
		if (combatant instanceof Delver && bloodshieldSwordCount > 0 && inCombat) {
			let convertedBlock = excessHealing * bloodshieldSwordCount;
			exports.addBlock(combatant, convertedBlock);
			adventure.updateArtifactStat("Bloodshield Sword", "Block Gained", convertedBlock);
		}
	}

	if (combatant.hp === combatant.maxHp) {
		return `${exports.getFullName(combatant, adventure.room.enemyTitles)} was fully healed${excessHealing && inCombat && bloodshieldSwordCount > 0 ? ` (and gained block)` : ""}!`;
	} else {
		return `${exports.getFullName(combatant, adventure.room.enemyTitles)} *gained ${healing} hp*.`
	}
}

exports.addBlock = function (combatant, integer) {
	combatant.block = integer;
	return combatant;
}

exports.clearBlock = function (combatant) {
	combatant.block = 0;
	return combatant;
}

/** Checks if adding the modifier inverts exisiting modifiers, increments the (remaining) stacks, then checks if stacks exceed a trigger threshold
 * @param {Combatant} combatant
 * @param {object} modifierData
 * @param {string} modifierData.name
 * @param {number} modifierData.stacks removes all if not parsable to an integer
 * @param {boolean} modifierData.force whether to ignore the Oblivious check
 * @returns {boolean} if the modifier was added (as opposed to being prevented by Oblivious)
 */
exports.addModifier = function (combatant, { name: modifier, stacks: pendingStacks, force = false }) {
	// Oblivious only blocks buffs and debuffs
	if (!("Oblivious" in combatant.modifiers && (isBuff(modifier) || isDebuff(modifier))) || force) {
		let inverse = getInverse(modifier);
		let inverseStacks = combatant.modifiers[inverse];
		if (inverseStacks) {
			exports.removeModifier(combatant, { name: inverse, stacks: pendingStacks, force: true });
			if (inverseStacks < pendingStacks) {
				combatant.modifiers[modifier] = pendingStacks - inverseStacks;
			}
		} else {
			if (combatant.modifiers[modifier]) {
				combatant.modifiers[modifier] += pendingStacks;
			} else {
				combatant.modifiers[modifier] = pendingStacks;
			}
		}

		// Trigger threshold: Stagger to Stun
		if (combatant.modifiers?.Stagger >= combatant.staggerThreshold) {
			combatant.modifiers.Stagger -= combatant.staggerThreshold;
			combatant.modifiers.Stun = 1;
			if ("Progress" in combatant.modifiers) {
				combatant.modifiers.Progress = Math.ceil(combatant.modifiers.Progress * 0.8);
			}
		}

		// Trigger threshold: Progress
		if (combatant.modifiers?.Progress >= 100) {
			combatant.modifiers.Progress -= 100;
			exports.addModifier(combatant, { name: "Power Up", stacks: 100, force: true });
			if ("Stasis" in combatant.modifiers) {
				combatant.modifiers.Stasis++;
			} else {
				combatant.modifiers.Stasis = 1;
			}
		}
		return true;
	} else {
		exports.removeModifier(combatant, { name: "Oblivious", stacks: 1, force: true });
		return false;
	}
}

/** After decrementing a modifier's stacks, delete the modifier's entry in the object
 * @param {Combatant} combatant
 * @param {object} modifierData
 * @param {string} modifierData.name
 * @param {number} modifierData.stacks removes all if not parsable to an integer
 * @param {boolean} modifierData.force whether to ignore the Stasis check (eg buffs/debuffs consuming themselves)
 * @returns {boolean} if the modifier was decremented (as opposed to being prevented by Stasis)
 */
exports.removeModifier = function (combatant, { name: modifier, stacks, force = false }) {
	// Stasis only protects buffs and debuffs
	if (!("Stasis" in combatant.modifiers && (isBuff(modifier) || isDebuff(modifier))) || force) {
		if (isNaN(parseInt(stacks)) || stacks >= combatant.modifiers[modifier]) {
			delete combatant.modifiers[modifier];
		} else if (modifier in combatant.modifiers) {
			combatant.modifiers[modifier] -= stacks;
		}
		return true;
	} else {
		exports.removeModifier(combatant, { name: "Stasis", stacks: 1, force: true });
		return false;
	}
}

/** Create a string containing the combatant's current modifiers
 * @param {Combatant} combatant
 * @param {boolean} includeStagger
 * @returns {string}
 */
exports.modifiersToString = function (combatant, includeStagger) {
	let modifiersText = "";
	for (let modifier in combatant.modifiers) {
		if (includeStagger || modifier !== "Stagger") {
			modifiersText += `*${modifier}${isNonStacking(modifier) ? "" : ` x ${combatant.modifiers[modifier]}`}* - ${getModifierDescription(modifier, combatant)}\n`;
		}
	}
	return modifiersText;
}
