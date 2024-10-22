const fs = require("fs");
const { ThreadChannel, EmbedBuilder, Message } = require("discord.js");
const { Adventure, CombatantReference } = require("../Classes/Adventure.js");
const Resource = require("../Classes/Resource.js");
const { Move } = require("../Classes/Move.js");
const Enemy = require("../Classes/Enemy.js");
const Delver = require("../Classes/Delver.js");
const { Room } = require("../Classes/Room.js");

const { SAFE_DELIMITER, MAX_SELECT_OPTIONS, MAX_MESSAGE_ACTION_ROWS } = require("../constants.js");
const { ensuredPathSave, generateRandomNumber, parseExpression, clearComponents } = require("../helpers.js");
const { getWeakness } = require("./elementHelpers.js");

const { rollArtifact } = require("./Artifacts/_artifactDictionary.js");
const { rollChallenges, getChallenge } = require("./Challenges/_challengeDictionary.js");
const { getEnemy } = require("./Enemies/_enemyDictionary");
const { rollEquipmentDrop, rollConsumable, getLabyrinthProperty, prerollBoss, rollRoom } = require("./labyrinths/_labyrinthDictionary.js");
const { getTurnDecrement } = require("./Modifiers/_modifierDictionary.js");

const { clearBlock, removeModifier, compareMoveSpeed, addModifier } = require("./combatantDAO.js");
const { spawnEnemy } = require("./enemyDAO.js");
const { getGuild, setGuild } = require("./guildDAO.js");
const { resolveMove } = require("./moveDAO.js");
const { renderRoom, updateRoomHeader } = require("./roomDAO.js");
const { getEquipmentProperty } = require("./equipment/_equipmentDictionary.js");
const { getConsumable } = require("./consumables/_consumablesDictionary.js");

const adventureDictionary = new Map();

exports.loadAdventures = async function () {
	const dirPath = "./Saves";
	const fileName = "adventures.json";
	const filePath = `${dirPath}/${fileName}`;
	const requirePath = "./../Saves/adventures.json";

	if (fs.existsSync(filePath)) {
		const adventures = require(requirePath);
		let loaded = 0;
		adventures.forEach(adventure => {
			if (!Adventure.endStates.includes(adventure.state)) {
				loaded++;
				// Cast delvers into Delver class
				let castDelvers = [];
				for (let delver of adventure.delvers) {
					castDelvers.push(Object.assign(new Delver(), delver));
				}
				adventure.delvers = castDelvers;

				if (adventure.room) {
					// Cast enemies into Enemy class
					if (adventure.room.enemies) {
						let castEnemies = [];
						for (let enemy of adventure.room.enemies) {
							castEnemies.push(Object.assign(new Enemy(), enemy));
						}
						adventure.room.enemies = castEnemies;
					}

					// Cast moves into Move class
					if (adventure.room.moves) {
						let castMoves = [];
						for (let move of adventure.room.moves) {
							castMoves.push(Object.assign(new Move(), move));
						}
						adventure.room.moves = castMoves;
					}
				}

				// Set adventure
				adventureDictionary.set(adventure.id, Object.assign(new Adventure(adventure.initialSeed, adventure.guildId), adventure));
			}
		})
		return `${loaded} adventures loaded`;
	} else {
		ensuredPathSave(dirPath, fileName, "[]");
		return "adventures regenerated";
	}
}

/** Get the adventure object associated with the given id
 * @param {string} id
 * @returns {Adventure}
 */
exports.getAdventure = function (id) {
	return adventureDictionary.get(id);
}

/** Save the given adventure
 * @param {Adventure} adventure
 */
exports.setAdventure = function (adventure) {
	adventureDictionary.set(adventure.id, adventure);
	ensuredPathSave("./Saves", "adventures.json", JSON.stringify(Array.from(adventureDictionary.values())));
}

/** @type {Record<number, string[]>} key = weight, value = roomTag[] */
const roomTypesByRarity = {
	1: ["Treasure"],
	3: ["Artifact Guardian"],
	5: ["Forge", "Rest Site", "Merchant"],
	10: ["Battle", "Event"]
};

/**
 * @param {Adventure} adventure
 */
function rollGearTier(adventure) {
	const cloverCount = adventure.getArtifactCount("Negative-One Leaf Clover");
	const baseUpgradeChance = 1 / 8;
	const cloverUpgradeChance = cloverCount > 0 ? 1 - 0.80 ** cloverCount : 1;
	const max = 144;
	const threshold = max * baseUpgradeChance / cloverUpgradeChance;
	adventure.updateArtifactStat("Negative-One Leaf Clover", "Expected Extra Rare Equipment", (threshold / max) - baseUpgradeChance);
	return generateRandomNumber(adventure, max, "general") < threshold ? "Rare" : "Common";
}

/** Set up the upcoming room: roll options for rooms after, update adventure's room meta data object for current room, and generate room's resources
 * @param {"Artifact Guardian" | "Treasure" | "Forge" | "Rest Site" | "Merchant" | "Battle" | "Event" | "Empty"} roomType
 * @param {ThreadChannel} thread
 */
exports.nextRoom = function (roomType, thread) {
	const adventure = exports.getAdventure(thread.id);

	adventure.delvers.forEach(delver => {
		delver.modifiers = {};
		delver.equipment.forEach(equipment => {
			if (equipment.name.startsWith("Organic")) {
				equipment.uses++;
			}
		})
	})

	const piggyBankCount = adventure.getArtifactCount("Piggy Bank");
	const interest = adventure.gold * piggyBankCount * 0.05;
	if (piggyBankCount > 0) {
		adventure.gainGold(interest);
		adventure.updateArtifactStat("Piggy Bank", "Interest Accrued", interest);
	}

	// Roll options for next room type
	if (!getLabyrinthProperty(adventure.labyrinth, "bossRoomDepths").includes(adventure.depth + 1)) {
		const mapCount = adventure.getArtifactCount("Enchanted Map");
		if (mapCount) {
			adventure.updateArtifactStat("Enchanted Map", "Extra Rooms Rolled", mapCount);
		}
		const numCandidates = 2 + mapCount;
		for (let i = 0; i < numCandidates; i++) {
			const roomWeights = Object.keys(roomTypesByRarity);
			const totalWeight = roomWeights.reduce((total, weight) => total + parseInt(weight), 0);
			let rn = generateRandomNumber(adventure, totalWeight, 'general');
			let tagPool = [];
			for (const weight of roomWeights.sort((a, b) => a - b)) {
				if (rn < weight) {
					tagPool = roomTypesByRarity[weight];
					break;
				} else {
					rn -= weight;
				}
			}
			const candidateTag = `${tagPool[generateRandomNumber(adventure, tagPool.length, "general")]}${SAFE_DELIMITER}${adventure.depth}`;
			if (!(candidateTag in adventure.roomCandidates)) {
				adventure.roomCandidates[candidateTag] = [];
				if (Object.keys(adventure.roomCandidates).length === MAX_MESSAGE_ACTION_ROWS) {
					break;
				}
			}
		}
	} else {
		adventure.roomCandidates[`Final Battle${SAFE_DELIMITER}${adventure.depth}`] = [];
	}

	// Generate current room
	const roomTemplate = rollRoom(roomType, adventure);
	adventure.room = new Room(roomTemplate);
	if (adventure.room.element === "@{adventure}") {
		adventure.room.element = adventure.element;
	} else if (adventure.room.element === "@{adventureWeakness}") {
		adventure.room.element = getWeakness(adventure.element);
	}

	// Initialize Resources
	for (const { resourceType: resource, count: unparsedCount, tier: unparsedTier, visibility, cost: unparsedCost, uiGroup } of roomTemplate.resourceList) {
		const count = Math.ceil(parseExpression(unparsedCount, adventure.delvers.length));
		switch (resource) {
			case "challenge":
				rollChallenges(Math.min(MAX_SELECT_OPTIONS, count), adventure).forEach(challengeName => {
					adventure.addResource(new Resource(challengeName, resource, true, visibility, 0, uiGroup));
				})
				break;
			case "equipment":
				let tier = unparsedTier;
				for (let i = 0; i < Math.min(MAX_SELECT_OPTIONS, count); i++) {
					if (unparsedTier === "?") {
						tier = rollGearTier(adventure);
					}
					const equipName = rollEquipmentDrop(tier, adventure);
					adventure.addResource(new Resource(equipName, resource, 1, visibility, Math.ceil(parseExpression(unparsedCost, getEquipmentProperty(equipName, "cost", resource))), uiGroup));
				}
				break;
			case "scouting":
				adventure.addResource(new Resource("bossScouting", resource, true, visibility, adventure.calculateScoutingCost("Final Battle"), uiGroup));
				adventure.addResource(new Resource("guardScouting", resource, true, visibility, adventure.calculateScoutingCost("Artifact Guardian"), uiGroup));
				break;
			case "artifact":
				const artifact = rollArtifact(adventure);
				adventure.addResource(new Resource(artifact, resource, count, visibility, "0", uiGroup));
				break;
			case "consumable":
				const consumable = rollConsumable(adventure);
				adventure.addResource(new Resource(consumable, resource, count, visibility, Math.ceil(parseExpression(unparsedCost, getConsumable(consumable).cost)), uiGroup));
				break;
			case "gold":
				// Randomize loot gold
				adventure.addResource(new Resource(resource, resource, visibility !== "internal" ? Math.ceil(count * (90 + generateRandomNumber(adventure, 21, "general")) / 100) : count, visibility, "0", uiGroup));
				break;
			default:
				adventure.addResource(new Resource(resource, resource, count, visibility, "0", uiGroup));
		}
	}

	if (adventure.room.hasEnemies) {
		if (roomType === "Artifact Guardian") {
			adventure.scouting.artifactGuardiansEncountered++;
			while (adventure.artifactGuardians.length <= adventure.scouting.artifactGuardiansEncountered + adventure.scouting.artifactGuardians) {
				prerollBoss("Artifact Guardian", adventure);
			}
			adventure.scouting.artifactGuardians = Math.max(adventure.scouting.artifactGuardians - 1, 0);
		}

		for (const enemyName in roomTemplate.enemyList) {
			for (let i = 0; i < Math.ceil(parseExpression(roomTemplate.enemyList[enemyName], adventure.delvers.length)); i++) {
				spawnEnemy(adventure, getEnemy(enemyName));
			}
		}
		exports.newRound(adventure, thread);
		exports.setAdventure(adventure);
	} else {
		thread.send(renderRoom(adventure, thread)).then(message => {
			adventure.messageIds.room = message.id;
			exports.setAdventure(adventure);
		});
	}
}

exports.endRoom = function (roomType, thread) {
	let adventure = exports.getAdventure(thread.id);
	adventure.depth++;
	adventure.room = {};
	// reset roomCandidates early enough (before being deferred to the callback stack) to prevent routevote racecondition
	adventure.roomCandidates = {};

	for (const challengeName in adventure.challenges) {
		if (adventure.challenges[challengeName].duration) {
			adventure.challenges[challengeName].duration--;
			if (adventure.challenges[challengeName].duration < 1) {
				getChallenge(challengeName).complete(adventure, thread);
			}
		}
	}
	exports.nextRoom(roomType, thread);
}

/** Cleans up previous combat round, generates events for current round, and sends room message
 * @param {Adventure} adventure
 * @param {ThreadChannel} thread
 * @param {string} lastRoundText
 */
exports.newRound = function (adventure, thread, lastRoundText) {
	// Increment round and clear last round's components
	adventure.room.round++;

	// Logistics for Next Round
	let teams = {
		"enemy": adventure.room.enemies,
		"delver": adventure.delvers
	}
	for (let teamName in teams) {
		teams[teamName].forEach((combatant, i) => {
			// Clear Excess Block if doesn't have vigilance
			if (combatant.getModifierStacks("Vigilance") == 0) {
				clearBlock(combatant);
			}
			// Roll Round Speed
			let percentBonus = (generateRandomNumber(adventure, 21, "battle") - 10) / 100;
			combatant.roundSpeed = Math.floor(combatant.speed * percentBonus);

			// Roll Critical Hit
			const baseCritChance = (1 + (combatant.critBonus / 100)) * (1 / 4);
			const max = 144;
			let threshold = max * baseCritChance;
			const featherCount = adventure.getArtifactCount("Hawk Tailfeather");
			if (featherCount > 0 && combatant instanceof Delver) {
				const featherCritChance = 1 - 0.85 ** featherCount;
				threshold /= featherCritChance;
				adventure.updateArtifactStat("Hawk Tailfeather", "Expected Extra Critical Hits", (threshold / max) - baseCritChance);
			}
			const critRoll = generateRandomNumber(adventure, max, "battle");
			combatant.crit = critRoll < threshold;

			// Roll Enemy Moves and Generate Dummy Moves
			const move = new Move()
				.setType("action")
				.onSetMoveSpeed(combatant)
				.setIsCrit(combatant.crit)
				.setUser(new CombatantReference(teamName, i))
			if (combatant.getModifierStacks("Stun") > 0) {
				// Dummy move for Stunned combatants
				move.setMoveName("Stun");
			} else {
				if (teamName === "enemy") {
					if (combatant.archetype !== "@{clone}") {
						let enemyTemplate = getEnemy(combatant.archetype);
						let actionName = combatant.nextAction;
						if (actionName === "random") {
							let actionPool = Object.keys(enemyTemplate.actions);
							actionName = actionPool[generateRandomNumber(adventure, actionPool.length, "battle")];
						}
						if (actionName === "a random protocol") {
							let actionPool = Object.keys(enemyTemplate.actions).filter(actionName => actionName.includes("Protocol"));
							actionName = actionPool[generateRandomNumber(adventure, actionPool.length, "battle")];
						}
						move.setMoveName(actionName);
						move.setPriority(enemyTemplate.actions[move.name].priority)
						enemyTemplate.actions[actionName].selector(adventure, combatant).forEach(({ team, index }) => {
							move.addTarget(new CombatantReference(team, index));
						})
						combatant.nextAction = enemyTemplate.actions[actionName].next(actionName);
					} else {
						move.setMoveName("@{clone}");
					}
				}
			}
			if (move.name) {
				adventure.room.moves.push(move);
			}

			// Decrement Modifiers
			for (const modifier in combatant.modifiers) {
				removeModifier(combatant, { name: modifier, stacks: getTurnDecrement(modifier), force: true })
			}

			// Persisting Round Effects
			const floatingMistStacks = combatant.getModifierStacks("Floating Mist Stance");
			if (floatingMistStacks > 0) {
				addModifier(combatant, { name: "Evade", stacks: floatingMistStacks * 2 });
			}
		})
	}

	thread.send(renderRoom(adventure, thread, lastRoundText)).then(message => {
		if (!exports.checkNextRound(adventure)) {
			updateRoomHeader(adventure, message);
			adventure.messageIds.battleRound = message.id;
		} else {
			clearComponents(message.id, thread.messages);
			exports.endRound(adventure, thread);
		}
		exports.setAdventure(adventure);
	});
}

/** Generate reactive moves, randomize speed ties, then resolve moves
 * @param {Adventure} adventure
 * @param {ThreadChannel} thread
 */
exports.endRound = async function (adventure, thread) {
	clearComponents(adventure.messageIds.battleRound, thread.messages);

	// Generate Reactive Moves by Enemies
	adventure.room.enemies.forEach((enemy, index) => {
		if (enemy.archetype === "@{clone}") {
			const move = adventure.room.moves.find(move => move.userReference.team === "enemy" && move.userReference.index === index);
			let counterpartMove = adventure.room.moves.find(move => move.userReference.team === "delver" && move.userReference.index == index);
			move.setType(counterpartMove.type)
				.setMoveName(counterpartMove.name);
			counterpartMove.targets.forEach(target => {
				if (target.team === "enemy") {
					move.addTarget(new CombatantReference("delver", target.index));
				} else {
					move.addTarget(new CombatantReference("enemy", target.index));
				}
			})

			// Replace placeholder
			let placeholderIdx = adventure.room.moves.findIndex(move => move.userReference.team === "enemy" && move.userReference.index == index)
			if (placeholderIdx >= 0) {
				adventure.room.moves.splice(placeholderIdx, 1, move);
			}
		}
	});


	// Randomize speed ties
	let randomOrderBag = Array(adventure.room.moves.length).fill().map((_, idx) => idx) // ensure that unique values are available for each move
	adventure.room.moves.forEach(move => {
		let rIdx = generateRandomNumber(adventure, randomOrderBag.length, "battle");
		move.randomOrder = randomOrderBag.splice(rIdx, 1)[0]; // pull a remaining randomOrder out of the bag and assign it to a move
	})
	adventure.room.moves.sort(compareMoveSpeed)

	// Resolve moves
	let lastRoundText = "";
	for (const move of adventure.room.moves) {
		lastRoundText += await resolveMove(move, adventure);
		// Check for end of combat
		if (adventure.lives <= 0) {
			adventure.room.round++;
			return thread.send(exports.completeAdventure(adventure, thread, "defeat", lastRoundText));
		}

		if (adventure.room.enemies.every(enemy => enemy.hp === 0)) {
			if (adventure.depth === getLabyrinthProperty(adventure.labyrinth, "maxDepth")) {
				return thread.send(exports.completeAdventure(adventure, thread, "success", lastRoundText));
			}

			// Equipment drops
			const gearThreshold = 1;
			const gearMax = 16;
			if (generateRandomNumber(adventure, gearMax, "general") < gearThreshold) {
				const tier = rollGearTier(adventure);
				const droppedEquip = rollEquipmentDrop(tier, adventure);
				adventure.addResource(new Resource(droppedEquip, "equipment", 1, "loot", 0));
			}

			// Consumable drops
			const consumableThreshold = 1;
			const consumableMax = 8;
			if (generateRandomNumber(adventure, consumableMax, "general") < consumableThreshold) {
				adventure.addResource(new Resource(rollConsumable(adventure), "consumable", 1, "loot", 0));
			}

			return thread.send(renderRoom(adventure, thread, lastRoundText));
		}
	}
	adventure.room.moves = [];
	exports.newRound(adventure, thread, lastRoundText);
}

/** The round ends when all combatants have readied all their moves
 * @param {Adventure} adventure
 * @returns {boolean}
 */
exports.checkNextRound = function ({ room, delvers }) {
	const readiedMoves = room.moves.length;
	const movesThisRound = room.enemies.length + delvers.length;
	return readiedMoves === movesThisRound;
}

/** The recruit message solicits new delvers to join (until the adventure starts) and shows the state of the adventure publically thereafter
 * @param {ThreadChannel} thread the adventure's thread
 * @param {string} messageId usually stored in `adventure.messageIds.recruit`
 * @returns {Promise<Message>}
 */
exports.fetchRecruitMessage = async function (thread, messageId) {
	const channel = await thread.guild.channels.fetch(thread.parentId);
	return channel.messages.fetch(messageId);
}

/**
 * @param {Adventure} adventure
 * @param {ThreadChannel} thread
 * @param {"success" | "defeat" | "giveup"} endState
 * @param {string?} descriptionOverride
 */
exports.completeAdventure = function (adventure, thread, endState, descriptionOverride) {
	const { messages: messageManager } = thread;
	exports.fetchRecruitMessage(thread, adventure.messageIds.recruit).then(recruitMessage => {
		const [{ data: recruitEmbed }] = recruitMessage.embeds;
		recruitMessage.edit({
			embeds: [
				new EmbedBuilder(recruitEmbed)
					.setTitle(recruitEmbed.title + ": COMPLETE!")
					.setThumbnail("https://cdn.discordapp.com/attachments/545684759276421120/734092918369026108/completion.png")
					.addFields({ name: "Seed", value: adventure.initialSeed })
			], components: []
		});
	})
	clearComponents(adventure.messageIds.battleRound, messageManager);
	clearComponents(adventure.messageIds.room, messageManager);
	[adventure.messageIds.utility].forEach(id => {
		if (id) {
			messageManager.delete(id).catch(console.error);
		}
	})

	adventure.state = endState;
	exports.setAdventure(adventure);
	const guildProfile = getGuild(thread.guild.id);
	adventure.delvers.forEach(delver => guildProfile.adventuring.delete(delver.id));
	setGuild(guildProfile);
	return renderRoom(adventure, thread, descriptionOverride);
}
