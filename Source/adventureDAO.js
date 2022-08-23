const fs = require("fs");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const Adventure = require("../Classes/Adventure.js");

const Move = require("../Classes/Move.js");
const Enemy = require("../Classes/Enemy.js");
const Delver = require("../Classes/Delver.js");
const Room = require("../Classes/Room.js");
const Resource = require("../Classes/Resource.js");
const { getWeakness, getColor } = require("./elementHelpers.js");
const { SAFE_DELIMITER, MAX_MESSAGE_ACTION_ROWS, MAX_SELECT_OPTIONS } = require("../constants.js");
const { ensuredPathSave, parseCount, generateRandomNumber, clearComponents } = require("../helpers.js");
const { getGuild } = require("./guildDAO.js");
const { setPlayer, getPlayer } = require("./playerDAO.js");
const { spawnEnemy } = require("./enemyDAO.js");
const { resolveMove } = require("./moveDAO.js");
const { clearBlock, removeModifier } = require("./combatantDAO.js");
const { manufactureRoomTemplate, prerollBoss } = require("./Rooms/_roomDictionary.js");
const { getTurnDecrement } = require("./Modifiers/_modifierDictionary.js");
const { getEquipmentProperty } = require("./equipment/_equipmentDictionary.js");
const { rollArtifact } = require("./Artifacts/_artifactDictionary.js");
const { getEnemy } = require("./Enemies/_enemyDictionary");
const { getChallenge, rollChallenges } = require("./Challenges/_challengeDictionary.js");
const { generateRoutingRow, generateLootRow, generateMerchantRows } = require("./roomDAO.js");
const { rollEquipmentDrop, rollConsumable } = require("./labyrinths/_labyrinthDictionary.js");

const dirPath = "./Saves";
const fileName = "adventures.json";
const filePath = `${dirPath}/${fileName}`;
const requirePath = "./../Saves/adventures.json";
const adventureDictionary = new Map();

exports.loadAdventures = async function () {
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

/** A room embed's author field contains the most important or commonly viewed party resources and stats
 * @param {Adventure} adventure
 * @returns {string} text to put in the author name field of a room embed
 */
function roomHeaderString({ lives, gold, accumulatedScore }) {
	return `Lives: ${lives} - Party Gold: ${gold} - Score: ${accumulatedScore}`;
}

exports.updateRoomHeader = function (adventure, message) {
	message.edit({ embeds: [message.embeds[0].setAuthor({ name: roomHeaderString(adventure), iconURL: message.client.user.displayAvatarURL() })] })
}

exports.nextRoom = async function (roomType, thread) {
	let adventure = exports.getAdventure(thread.id);
	// Roll options for next room type
	let roomTypes = ["Battle", "Event", "Forge", "Rest Site", "Artifact Guardian", "Merchant"]; //TODO #126 add weights to room types
	let finalBossDepths = [10];
	if (!finalBossDepths.includes(adventure.depth + 1)) {
		let mapCount = adventure.getArtifactCount("Enchanted Map");
		let numCandidates = 2 + mapCount;
		if (mapCount) {
			adventure.updateArtifactStat("Enchanted Map", "Extra Rooms Rolled", mapCount);
		}
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
	let roomTemplate = manufactureRoomTemplate(roomType, adventure);
	adventure.room = new Room(roomTemplate.title, roomTemplate.element);
	if (adventure.room.element === "@{adventure}") {
		adventure.room.element = adventure.element;
	} else if (adventure.room.element === "@{adventureWeakness}") {
		adventure.room.element = getWeakness(adventure.element);
	}
	let embed = new MessageEmbed().setColor(getColor(adventure.room.element))
		.setAuthor({ name: roomHeaderString(adventure), iconURL: thread.client.user.displayAvatarURL() })
		.setTitle(roomTemplate.title)
		.setDescription(roomTemplate.description.replace("@{roomElement}", adventure.room.element))
		.setFooter({ text: `Room #${adventure.depth}` });
	for (let resource in roomTemplate.resourceList) {
		if (resource === "challenges") {
			rollChallenges(2, adventure).forEach(challengeName => {
				adventure.room.resources[challengeName] = new Resource(challengeName, "challenges", true, "resource", 0);
			})
		} else {
			let count = parseCount(roomTemplate.resourceList[resource], adventure.delvers.length);
			let resourceType;
			if (resource === "forgeSupplies") {
				embed.addField("Remaining Forge Supplies", count.toString());
				resourceType = "resource";
			}
			adventure.room.resources[resource] = new Resource(resource, resourceType, count, "resource", 0);
		}
	}
	if (["Battle", "Artifact Guardian", "Final Battle"].includes(roomType)) {
		// Generate combat room
		if (roomType === "Artifact Guardian") {
			adventure.scouting.artifactGuardiansEncountered++;
			while (adventure.artifactGuardians.length <= adventure.scouting.artifactGuardiansEncountered) {
				prerollBoss("Artifact Guardian", adventure);
			}
			let artifact = rollArtifact(adventure);
			adventure.room.resources[artifact] = new Resource(artifact, "artifact", 1, "loot", 0);
		}
		adventure.room.initializeCombatProperties();
		let randomizeHp = roomType === "Battle";
		for (let enemyName in roomTemplate.enemyList) {
			for (let i = 0; i < parseCount(roomTemplate.enemyList[enemyName], adventure.delvers.length); i++) {
				spawnEnemy(adventure, getEnemy(enemyName), randomizeHp);
			}
		}
		exports.newRound(adventure, thread, embed);
	} else {
		// Generate non-combat room
		const cloverCount = adventure.getArtifactCount("Negative-One Leaf Clover");
		for (let category in roomTemplate.saleList) {
			if (category.startsWith("equipment")) {
				let [type, tier] = category.split(SAFE_DELIMITER);
				let parsedTier = tier;
				let count = Math.min(MAX_SELECT_OPTIONS, parseCount(roomTemplate.saleList[category], adventure.delvers.length));
				for (let i = 0; i < count; i++) {
					if (tier === "?") {
						let threshold = 1 + cloverCount;
						let max = 8 + cloverCount;
						adventure.updateArtifactStat("Negative-One Leaf Clover", "Expected Extra Rare Equipment", (threshold / max) - (1 / 8));
						if (generateRandomNumber(adventure, max, "general") < threshold) {
							parsedTier = "Rare"; //TODONOW find other tiers and convert to enums
						} else {
							parsedTier = "Common";
						}
					}
					const equipName = rollEquipmentDrop(parsedTier, adventure);
					adventure.addResource(new Resource(equipName, "equipment", 1, "merchant", getEquipmentProperty(equipName, "cost"))
						.setUIGroup(category));
				}
			} else if (category === "scouting") {
				adventure.room.resources["bossScouting"] = new Resource("bossScouting", "scouting", true, "merchant", adventure.calculateScoutingCost("Final Battle"))
					.setUIGroup("scouting");
				adventure.room.resources["guardScouting"] = new Resource("guardScouting", "scouting", true, "merchant", adventure.calculateScoutingCost("Artifact Guardian"))
					.setUIGroup("scouting");
			}
		}
		if (adventure.depth < 10) {
			let roomMessage = await thread.send({
				embeds: [embed.addField("Decide the next room", "Each delver can pick or change their pick for the next room. The party will move on when the decision is unanimous.")],
				components: [...roomTemplate.uiRows, ...generateMerchantRows(adventure), generateRoutingRow(adventure)]
			});
			adventure.messageIds.room = roomMessage.id;
		} else {
			thread.send({
				embeds: [embed, exports.completeAdventure(adventure, thread, { isSuccess: true, description: null })],
				components: [new MessageActionRow().addComponents(
					new MessageButton().setCustomId("viewcollectartifact")
						.setLabel("Collect Artifact")
						.setStyle("SUCCESS")
				)]
			})
		}
	}
	exports.setAdventure(adventure);
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

exports.newRound = function (adventure, thread, embed = new MessageEmbed()) {
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
						move.setMoveName("${clone}");
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

	embed.setColor(getColor(adventure.room.element))
		.setFooter({ text: `Room #${adventure.depth} - Round ${adventure.room.round}` });
	if (!exports.checkNextRound(adventure)) {
		const battleButtons = [
			new MessageButton().setCustomId("inspectself")
				.setLabel("Inspect Self")
				.setStyle("SECONDARY"),
			new MessageButton().setCustomId("predict")
				.setEmoji("🔮")
				.setLabel("Predict")
				.setStyle("SECONDARY"),
			new MessageButton().setCustomId("readymove")
				.setLabel("Ready a Move")
				.setStyle("PRIMARY")
		];
		if (Object.values(adventure.consumables).some(quantity => quantity > 0)) {
			battleButtons.push(
				new MessageButton().setCustomId("readyconsumable")
					.setLabel("Ready a Consumable")
					.setStyle("PRIMARY")
			)
		}
		thread.send({
			embeds: [embed], components: [new MessageActionRow().addComponents(...battleButtons)]
		}).then(message => {
			exports.updateRoomHeader(adventure, message);
			adventure.messageIds.battleRound = message.id;
			exports.setAdventure(adventure);
		});
	} else {
		thread.send({ embeds: [embed] });
		exports.endRound(adventure, thread);
		exports.setAdventure(adventure);
	}
}

exports.endRound = async function (adventure, thread) {
	// Generate results embed
	let embed = new MessageEmbed().setAuthor({ name: roomHeaderString(adventure), iconURL: thread.client.user.displayAvatarURL() })
		.setTitle(adventure.room.title);

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
		// Check for Defeat
		if (adventure.lives <= 0) {
			thread.send({ embeds: [exports.completeAdventure(adventure, thread, { isSuccess: false, description: lastRoundText })] })
			return;
		}

		// Check for Victory
		if (adventure.room.enemies.every(enemy => enemy.hp === 0)) {
			// Generate gold
			let totalBounty = adventure.room.enemies.reduce((total, enemy) => total + enemy.bounty, adventure.room.resources.gold.count);
			totalBounty *= (90 + generateRandomNumber(adventure, 21, "general")) / 100;
			adventure.room.resources.gold.count = Math.ceil(totalBounty);

			const dropThreshold = 1;
			const dropMax = 8;
			// Equipment drops
			if (generateRandomNumber(adventure, dropMax, "general") < dropThreshold) {
				const cloverCount = adventure.getArtifactCount("Negative-One Leaf Clover");
				let tier = "Common";
				let upgradeThreshold = 1 + cloverCount;
				let upgradeMax = 8 + cloverCount;
				if (generateRandomNumber(adventure, upgradeMax, "general") < upgradeThreshold) {
					tier = "Rare";
				}
				adventure.addResource(new Resource(rollEquipmentDrop(tier, adventure), "equipment", 1, "loot", 0));
			}

			// Consumable drops
			if (generateRandomNumber(adventure, dropMax, "general") < dropThreshold) {
				adventure.addResource(new Resource(rollConsumable(adventure), "consumable", 1, "loot", 0));
			}

			// Finalize UI
			embed = embed.setTitle("Victory!").setDescription(lastRoundText)
				.setColor(getColor(adventure.room.element));
			if (adventure.depth < 10) {
				return thread.send({
					embeds: [embed.addField("Decide the next room", "Each delver can pick or change their pick for the next room. The party will move on when the decision is unanimous.")],
					components: [generateLootRow(adventure), generateRoutingRow(adventure)]
				}).then(message => {
					adventure.messageIds.room = message.id;
					adventure.room.moves = [];
					adventure.delvers.forEach(delver => {
						delver.modifiers = {};
					})
					return adventure;
				}).then(adventure => {
					exports.setAdventure(adventure);
				});
			} else {
				return thread.send({
					embeds: [embed, exports.completeAdventure(adventure, thread, { isSuccess: true, description: null })],
					components: [new MessageActionRow().addComponents(
						new MessageButton().setCustomId("viewcollectartifact")
							.setLabel("Collect Artifact")
							.setStyle("SUCCESS")
					)]
				})
			}
		}
	}
	adventure.room.priorityMoves = [];
	adventure.room.moves = [];
	exports.newRound(adventure, thread, embed.setDescription(lastRoundText));
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

exports.completeAdventure = function (adventure, thread, { isSuccess, description }) {
	let livesScore = adventure.lives * 10;
	let goldScore = Math.floor(Math.log10(adventure.peakGold)) * 5;
	let score = adventure.accumulatedScore + livesScore + goldScore + adventure.depth;
	let challengeMultiplier = 1;
	Object.keys(adventure.challenges).forEach(challengeName => {
		const challenge = getChallenge(challengeName);
		challengeMultiplier *= challenge.scoreMultiplier;
	})
	score *= challengeMultiplier;
	let scoreEmbed = new MessageEmbed();
	if (description) {
		scoreEmbed.setDescription(description);
	}
	if (!isSuccess) {
		scoreEmbed.setTitle("Defeat");
		score = Math.floor(score / 2);
	} else {
		scoreEmbed.setTitle("Success");
	}
	let skippedStartingArtifactMultiplier = 1 + (adventure.delvers.reduce((count, delver) => delver.startingArtifact ? count : count + 1, 0) / adventure.delvers.length);
	score = Math.max(1, score * skippedStartingArtifactMultiplier);
	scoreEmbed.addField("Score Breakdown", `Depth: ${adventure.depth}\nLives: ${livesScore}\nGold: ${goldScore}\nBonus: ${adventure.accumulatedScore}\nChallenges Multiplier: ${challengeMultiplier}\nMultiplier (Skipped Starting Artifacts): ${skippedStartingArtifactMultiplier}\n\n__Total__: ${!isSuccess && score > 0 ? `score ÷ 2  = ${score} (Defeat)` : score}`);

	let guildId = thread.guildId;
	let guildProfile = getGuild(guildId);
	adventure.delvers.forEach(delver => {
		let player = getPlayer(delver.id, guildId);
		if (player.scores[guildId]) {
			player.scores[guildId] += score;
		} else {
			player.scores[guildId] = score;
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
	clearComponents(adventure.messageIds.battleRound, thread.messages);
	clearComponents(adventure.messageIds.room, thread.messages);
	[adventure.messageIds.utility, adventure.messageIds.deploy, adventure.messageIds.leaderNotice].forEach(id => {
		if (id) {
			thread.messages.delete(id);
		}
	})

	adventure.state = "completed";
	exports.setAdventure(adventure);
	return scoreEmbed;
}
