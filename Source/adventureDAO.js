const fs = require("fs");
const Adventure = require("../Classes/Adventure.js");
const Move = require("../Classes/Move.js");
const Enemy = require("../Classes/Enemy.js");
const Delver = require("../Classes/Delver.js");
const Room = require("../Classes/Room.js");

const { SAFE_DELIMITER, MAX_SELECT_OPTIONS, MAX_MESSAGE_ACTION_ROWS } = require("../constants.js");
const { ensuredPathSave, generateRandomNumber, parseCount, clearComponents } = require("../helpers.js");
const { getWeakness } = require("./elementHelpers.js");

const { rollArtifact } = require("./Artifacts/_artifactDictionary.js");
const { rollChallenges, getChallenge } = require("./Challenges/_challengeDictionary.js");
const { getEnemy } = require("./Enemies/_enemyDictionary");
const { rollEquipmentDrop, rollConsumable, getLabyrinthProperty, prerollBoss, rollRoom } = require("./labyrinths/_labyrinthDictionary.js");
const { getTurnDecrement } = require("./Modifiers/_modifierDictionary.js");

const { clearBlock, removeModifier } = require("./combatantDAO.js");
const { spawnEnemy } = require("./enemyDAO.js");
const { getGuild } = require("./guildDAO.js");
const { resolveMove } = require("./moveDAO.js");
const { setPlayer, getPlayer } = require("./playerDAO.js");
const { renderRoom, updateRoomHeader } = require("./roomDAO.js");
const { getEquipmentProperty } = require("./equipment/_equipmentDictionary.js");
const { ThreadChannel } = require("discord.js");

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
			if (adventure.state !== "completed") {
				loaded++;
				// Cast delvers into Delver class
				let castDelvers = [];
				let guildProfile = getGuild(adventure.guildId);
				for (let delver of adventure.delvers) {
					castDelvers.push(Object.assign(new Delver(), delver));
					if (!guildProfile.adventuring.has(delver.id)) {
						guildProfile.adventuring.add(delver.id);
					}
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

exports.nextRoom = function (roomType, thread) {
	const adventure = exports.getAdventure(thread.id);

	adventure.delvers.forEach(delver => {
		delver.modifiers = {};
	})

	// Roll options for next room type
	const roomTypes = ["Battle", "Event", "Forge", "Rest Site", "Artifact Guardian", "Merchant", "Treasure"]; //TODO #126 add weights to room types
	if (!getLabyrinthProperty(adventure.labyrinth, "bossRoomDepths").includes(adventure.depth + 1)) {
		const mapCount = adventure.getArtifactCount("Enchanted Map");
		if (mapCount) {
			adventure.updateArtifactStat("Enchanted Map", "Extra Rooms Rolled", mapCount);
		}
		const numCandidates = 2 + mapCount;
		for (let i = 0; i < numCandidates; i++) {
			const candidateTag = `${roomTypes[generateRandomNumber(adventure, roomTypes.length, "general")]}${SAFE_DELIMITER}${adventure.depth}`;
			if (!(candidateTag in adventure.roomCandidates)) {
				adventure.roomCandidates[candidateTag] = [];
				if (Object.keys(adventure.roomCandidates).length === MAX_MESSAGE_ACTION_ROWS) {
					break;
				}
			}
		}
	} else {
		adventure.roomCandidates[`Final Battle${SAFE_DELIMITER}${adventure.depth}`] = true;
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
	const cloverCount = adventure.getArtifactCount("Negative-One Leaf Clover");
	for (const { resourceType: resource, count: unparsedCount, tier: unparsedTier, visibility, cost: unparsedCost, uiGroup } of roomTemplate.resourceList) {
		const count = Math.min(MAX_SELECT_OPTIONS, parseCount(unparsedCount, adventure.delvers.length));
		switch (resource) {
			case "challenge":
				rollChallenges(count, adventure).forEach(challengeName => {
					adventure.addResource(challengeName, resource, true, visibility, 0);
				})
				break;
			case "equipment":
				let tier = unparsedTier;
				for (let i = 0; i < count; i++) {
					if (unparsedTier === "?") {
						let threshold = 1 + cloverCount;
						let max = 8 + cloverCount;
						adventure.updateArtifactStat("Negative-One Leaf Clover", "Expected Extra Rare Equipment", (threshold / max) - (1 / 8));
						if (generateRandomNumber(adventure, max, "general") < threshold) {
							tier = "Rare";
						} else {
							tier = "Common";
						}
					}
					const equipName = rollEquipmentDrop(tier, adventure);
					adventure.addResource(equipName, resource, 1, visibility, parseCount(unparsedCost, getEquipmentProperty(equipName, "cost", resource)), uiGroup);
				}
				break;
			case "scouting":
				adventure.addResource("bossScouting", resource, true, visibility, adventure.calculateScoutingCost("Final Battle"), uiGroup);
				adventure.addResource("guardScouting", resource, true, visibility, adventure.calculateScoutingCost("Artifact Guardian"), uiGroup);
				break;
			case "artifact":
				const artifact = rollArtifact(adventure);
				adventure.addResource(artifact, resource, count, visibility, "0", uiGroup);
				break;
			case "consumable":
				const consumable = rollConsumable(adventure);
				adventure.addResource(consumable, resource, count, visibility, "0", uiGroup);
				break;
			case "gold":
				// Randomize loot gold
				adventure.addResource(resource, resource, visibility === "loot" ? Math.ceil(count * (90 + generateRandomNumber(adventure, 21, "general")) / 100) : count, visibility, "0", uiGroup);
			default:
				adventure.addResource(resource, resource, count, visibility, "0", uiGroup);
		}
	}

	if (adventure.room.hasEnemies) {
		if (roomType === "Artifact Guardian") {
			adventure.scouting.artifactGuardiansEncountered++;
			while (adventure.artifactGuardians.length <= adventure.scouting.artifactGuardiansEncountered) {
				prerollBoss("Artifact Guardian", adventure);
			}
		}

		const randomizeHp = roomType === "Battle";
		for (const enemyName in roomTemplate.enemyList) {
			for (let i = 0; i < parseCount(roomTemplate.enemyList[enemyName], adventure.delvers.length); i++) {
				spawnEnemy(adventure, getEnemy(enemyName), randomizeHp);
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
	clearComponents(adventure.messageIds.battleRound, thread.messages);

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
			let threshold = combatant.getCritNumerator(adventure.getArtifactCount("Hawk Tailfeather"));
			let max = combatant.getCritDenominator(adventure.getArtifactCount("Hawk Tailfeather"));
			let critRoll = generateRandomNumber(adventure, max, "battle");
			combatant.crit = critRoll < threshold;
			if (combatant instanceof Delver) {
				adventure.updateArtifactStat("Hawk Tailfeather", "Expected Extra Critical Hits", (threshold / max) - (1 / 4));
			}

			// Roll Enemy Moves and Generate Dummy Moves
			let move = new Move()
				.setType("action")
				.onSetMoveSpeed(combatant)
				.setIsCrit(combatant.crit)
				.setUser(teamName, i)
			if (combatant.getModifierStacks("Stun") > 0) {
				// Dummy move for Stunned combatants
				move.setMoveName("Stun");
			} else {
				if (teamName === "enemy") {
					if (combatant.lookupName !== "@{clone}") {
						let enemyTemplate = getEnemy(combatant.lookupName);
						let actionName = combatant.nextAction;
						if (actionName === "random") {
							let actionPool = Object.keys(enemyTemplate.actions);
							actionName = actionPool[generateRandomNumber(adventure, actionPool.length, "battle")];
						}
						move.setMoveName(actionName);
						enemyTemplate.actions[actionName].selector(adventure, combatant).forEach(({ team, index }) => {
							move.addTarget(team, index);
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
		})
	}

	thread.send(renderRoom(adventure, thread, lastRoundText)).then(message => {
		if (!exports.checkNextRound(adventure)) {
			updateRoomHeader(adventure, message);
			adventure.messageIds.battleRound = message.id;
		} else {
			exports.endRound(adventure, thread);
		}
		exports.setAdventure(adventure);
	});
}

exports.endRound = async function (adventure, thread) {
	// Generate Reactive Moves by Enemies
	adventure.room.enemies.forEach((enemy, index) => {
		if (enemy.lookupName === "@{clone}") {
			let move = new Move()
				.setType("action")
				.onSetMoveSpeed(enemy)
				.setIsCrit(enemy.crit)
			let counterpartHasPriority = false;
			let counterpartMove = adventure.room.moves.find(move => move.userTeam === "delver" && move.userIndex == index);
			if (!counterpartMove) {
				counterpartMove = adventure.room.priorityMoves.find(move => move.userTeam === "delver" && move.userIndex == index);
				counterpartHasPriority = true;
			}
			move.setUser("clone", index)
				.setMoveName(counterpartMove.name);
			counterpartMove.targets.forEach(target => {
				if (target.team === "enemy") {
					move.addTarget("delver", target.index);
				} else {
					move.addTarget("enemy", target.index);
				}
			})
			if (counterpartHasPriority) {
				adventure.room.priorityMoves.splice(adventure.room.priorityMoves.findIndex(move => move.userTeam === "enemy" && move.userIndex == index), 1, move);
			} else {
				adventure.room.moves.splice(adventure.room.moves.findIndex(move => move.userTeam === "enemy" && move.userIndex == index), 1, move);
			}
		}
	});


	// Randomize speed ties
	[adventure.room.priorityMoves, adventure.room.moves].forEach(moveQueue => {
		moveQueue.forEach(move => {
			move.speed += generateRandomNumber(adventure, 10, "battle") / 10;
		})
		moveQueue.sort((first, second) => {
			return second.speed - first.speed;
		})
	})

	// Resolve moves
	let lastRoundText = "";
	for (const move of adventure.room.priorityMoves.concat(adventure.room.moves)) {
		lastRoundText += await resolveMove(move, adventure);
		// Check for end of combat
		if (adventure.lives <= 0 || adventure.room.enemies.every(enemy => enemy.hp === 0)) {
			if (adventure.lives <= 0 || adventure.depth === getLabyrinthProperty(adventure.labyrinth, "maxDepth")) {
				if (adventure.room.enemies.every(enemy => enemy.hp === 0) && adventure.depth === getLabyrinthProperty(adventure.labyrinth, "maxDepth")) {
					adventure.depth++;
				}
				return thread.send(exports.completeAdventure(adventure, thread, lastRoundText));
			} else {
				return thread.send(renderRoom(adventure, thread, lastRoundText));
			}
		}
	}
	adventure.room.priorityMoves = [];
	adventure.room.moves = [];
	exports.newRound(adventure, thread, lastRoundText);
}

/** The round ends when all combatants have readied all their moves
 * @param {Adventure} adventure
 * @returns {boolean}
 */
exports.checkNextRound = function ({ room, delvers }) {
	const readiedMoves = room.moves.length + room.priorityMoves.length;
	const movesThisRound = room.enemies.length + delvers.length;
	return readiedMoves === movesThisRound;
}

exports.completeAdventure = function (adventure, thread, descriptionOverride) {
	const { guildId, messages: messageManager } = thread;
	const guildProfile = getGuild(guildId);
	adventure.delvers.forEach(delver => {
		let player = getPlayer(delver.id, guildId);
		if (player.scores[guildId]) {
			player.scores[guildId] += adventure.accumulatedScore;
		} else {
			player.scores[guildId] = adventure.accumulatedScore;
		}
		setPlayer(player);
		guildProfile.adventuring.delete(delver.id);
	})

	thread.fetchStarterMessage({ cache: false, force: true }).then(recruitMessage => {
		let [recruitEmbed] = recruitMessage.embeds;
		recruitEmbed.setTitle(recruitEmbed.title + ": COMPLETE!")
			.setThumbnail("https://cdn.discordapp.com/attachments/545684759276421120/734092918369026108/completion.png")
			.addField("Seed", adventure.initialSeed);
		recruitMessage.edit({ embeds: [recruitEmbed], components: [] });
	})
	clearComponents(adventure.messageIds.battleRound, messageManager);
	clearComponents(adventure.messageIds.room, messageManager);
	[adventure.messageIds.utility, adventure.messageIds.deploy, adventure.messageIds.leaderNotice].forEach(id => {
		if (id) {
			messageManager.delete(id);
		}
	})

	adventure.state = "completed";
	exports.setAdventure(adventure);
	return renderRoom(adventure, thread, descriptionOverride);
}
