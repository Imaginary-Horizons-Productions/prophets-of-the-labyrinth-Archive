const { Adventure, CombatantReference } = require("../Classes/Adventure.js");
const { Move } = require("../Classes/Move.js");
const { generateRandomNumber } = require("../helpers.js");
const { dealDamage, gainHealth, removeModifier } = require("./combatantDAO.js");
const { getConsumable } = require("./consumables/_consumablesDictionary.js");
const { getEmoji, getOpposite } = require("./elementHelpers.js");
const { getEnemy } = require("./Enemies/_enemyDictionary.js");
const { getEquipmentProperty } = require("./equipment/_equipmentDictionary.js");

/** Updates game state with the move's effect AND returns the game's description of what happened
 * @param {Move} move
 * @param {Adventure} adventure
 * @returns {Promise<string>} result text
 */
exports.resolveMove = async function (move, adventure) {
	const user = adventure.getCombatant(move.userReference);
	if (!user || user.hp < 1) {
		return "";
	}

	let moveText = `**${user.getName(adventure.room.enemyIdMap)}** `;
	if (move.name !== "Stun" && user.getModifierStacks("Stun") < 1) {
		if (move.isCrit) {
			moveText = `💥${moveText}`;
		}

		let effect;
		let breakText = "";
		switch (move.type) {
			case "action":
				if (move.userReference.team !== "delver") {
					const action = getEnemy(user.archetype).actions[move.name];
					let parsedElement = action.element;
					if (parsedElement === "@{adventure}") {
						parsedElement = adventure.element;
					} else if (parsedElement === "@{adventureOpposite}") {
						parsedElement = getOpposite(adventure.element);
					}
					effect = action.effect;
					moveText = `${getEmoji(parsedElement)} ${moveText}`;
				}
				break;
			case "equip":
				effect = getEquipmentProperty(move.name, "effect");
				if (move.name !== "Punch" && move.userReference.team !== "enemy") {
					let decrementDurability = true;
					const equipCategory = getEquipmentProperty(move.name, "category");
					if (equipCategory === "Spell") {
						const crystalShardCount = adventure.getArtifactCount("Crystal Shard");
						if (crystalShardCount > 0) {
							const durabilitySaveChance = 1 - 0.85 ** crystalShardCount;
							const max = 144;
							adventure.updateArtifactStat("Crystal Shard", "Expected Durability Saved", durabilitySaveChance.toFixed(2));
							if (generateRandomNumber(adventure, max, "battle") < max * durabilitySaveChance) {
								decrementDurability = false;
								adventure.updateArtifactStat("Crystal Shard", "Actual Durability Saved", 1);
							}
						}
					}
					if (decrementDurability) {
						const equip = user.equipment.find(equip => equip.name === move.name);
						equip.uses--;
						if (equip.uses < 1) {
							breakText = ` The ${move.name} broke!`;
						}
					}
				}
				moveText = `${getEmoji(getEquipmentProperty(move.name, "element"))} ${moveText}`;
				break;
			case "consumable":
				const { effect: consumableEffect, element } = getConsumable(move.name);
				effect = consumableEffect;
				if (move.userReference.team !== "enemy") {
					adventure.consumables[move.name]--;
					if (adventure.consumables[move.name] < 1) {
						delete adventure.consumables[move.name];
					}
				}
				moveText = `${getEmoji(element)} ${moveText}`;
				break;
		}

		const targets = move.targets.map(targetReference => adventure.getCombatant(targetReference)).filter(reference => !!reference);
		const resultText = await effect(targets, adventure.getCombatant(move.userReference), move.isCrit, adventure);

		moveText += `used ${move.name}. ${resultText}${breakText}`;
	} else {
		removeModifier(user, { name: "Stun", stacks: "all" });
		moveText = `💫 ${moveText} is Stunned!`;
	}

	// Poison/Regen
	const poisonStacks = user.getModifierStacks("Poison");
	let poisonDamage = poisonStacks * 10;
	if (user.team === "enemy") {
		const funnelDamage = adventure.getArtifactCount("Spiral Funnel") * 5 * poisonStacks;
		poisonDamage += funnelDamage;
		adventure.updateArtifactStat("Spiral Funnel", "Additional Damage", funnelDamage);
	}

	const regenStacks = user.getModifierStacks("Regen");
	if (poisonDamage) {
		moveText += ` ${await dealDamage(user, null, poisonDamage, true, "Poison", adventure)}`;
	} else if (regenStacks) {
		moveText += ` ${gainHealth(user, regenStacks * 10, adventure)}`;
	}
	return `${moveText}\n`;
}

/** Get the full names of the targets
 * @param {CombatantReference[]} targets
 * @param {Adventure} adventure
 * @returns
 */
exports.getTargetList = function (targets, adventure) {
	const targetList = [];
	for (const targetReference of targets) {
		const target = adventure.getCombatant(targetReference);
		if (target) {
			targetList.push(target.getName(adventure.room.enemyIdMap));
		}
	}
	return targetList;
}
