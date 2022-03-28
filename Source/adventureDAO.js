const fs = require("fs");
const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require("discord.js");
const Adventure = require("../Classes/Adventure.js");

const Move = require("../Classes/Move.js");
const Enemy = require("../Classes/Enemy.js");
const Delver = require("../Classes/Delver.js");
const Room = require("../Classes/Room.js");
const Resource = require("../Classes/Resource.js");
const { getWeaknesses, getColor } = require("./elementHelpers.js");

// define injectable vars
let
	//helpers
	ensuredPathSave,
	parseCount,
	generateRandomNumber,
	clearComponents,
	ordinalSuffixEN,
	SAFE_DELIMITER,
	//guildDAO
	getGuild,
	//playerDAO
	setPlayer,
	getPlayer,
	//enemyDAO
	spawnEnemy,
	// moveDAO
	resolveMove,
	//combatantDAO
	clearBlock,
	removeModifier,
	//roomDictionary
	manufactureRoomTemplate,
	prerollBoss,
	//modifierDictionary
	getTurnDecrement,
	//weaponDictionary
	rollWeaponDrop,
	getWeaponProperty,
	buildWeaponDescription,
	//artifactDictionary
	rollArtifact,
	//enemyDictionary
	getEnemy,
	//challengeDictionary
	getChallenge;
exports.injectConfig = function (isProduction) {
	({ ensuredPathSave, parseCount, generateRandomNumber, clearComponents, ordinalSuffixEN, SAFE_DELIMITER } = require("../helpers.js").injectConfig(isProduction));
	({ getGuild } = require("./guildDAO.js").injectConfig(isProduction));
	({ setPlayer, getPlayer } = require("./playerDAO.js").injectConfig(isProduction));
	({ spawnEnemy } = require("./enemyDAO.js").injectConfig(isProduction));
	({ resolveMove } = require("./moveDAO.js").injectConfig(isProduction));
	({ clearBlock, removeModifier } = require("./combatantDAO.js").injectConfig(isProduction));
	({ manufactureRoomTemplate, prerollBoss } = require("./Rooms/_roomDictionary.js").injectConfig(isProduction));
	({ getTurnDecrement } = require("./Modifiers/_modifierDictionary.js").injectConfig(isProduction));
	({ rollWeaponDrop, getWeaponProperty, buildWeaponDescription } = require("./Weapons/_weaponDictionary.js").injectConfig(isProduction));
	({ getArtifact, rollArtifact, getArtifactDescription } = require("./Artifacts/_artifactDictionary.js").injectConfigArtifacts(isProduction));
	({ getEnemy } = require("./Enemies/_enemyDictionary").injectConfigEnemies(isProduction));
	({ getChallenge } = require("./Challenges/_challengeDictionary.js").injectConfigChallenges(isProduction));
	return this;
}

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

exports.getAdventure = function (id) {
	return adventureDictionary.get(id);
}

exports.setAdventure = function (adventure) {
	adventureDictionary.set(adventure.id, adventure);
	saveAdventures();
}

function roomHeaderString(adventure) {
	return `Lives: ${adventure.lives} - Party Gold: ${adventure.gold} - Score: ${adventure.accumulatedScore}`;
}

exports.updateRoomHeader = function (adventure, message) {
	message.edit({ embeds: [message.embeds[0].setAuthor({ name: roomHeaderString(adventure), iconURL: message.client.user.displayAvatarURL() })] })
}

exports.nextRoom = async function (roomType, adventure, thread) {
	// Clean up old room
	adventure.depth++;
	adventure.room = {};

	// Roll options for next room type
	let roomTypes = ["Battle", "Event", "Forge", "Rest Site", "Artifact Guardian", "Merchant"]; //TODO #126 add weights to room types
	let finalBossDepths = [10];
	if (!finalBossDepths.includes(adventure.depth + 1)) {
		adventure.roomCandidates = {};
		let numCandidates = 2 + (adventure.artifacts["Enchanted Map"] || 0);
		let candidateType = "";
		for (let i = 0; i < numCandidates; i++) {
			candidateType = roomTypes[generateRandomNumber(adventure, roomTypes.length, "general")];
			if (!adventure.roomCandidates[candidateType]) {
				adventure.roomCandidates[candidateType] = [];
				if (Object.keys(adventure.roomCandidates).length === 5) {
					// Should not execed 5, as only 5 buttons can be in a MessageActionRow
					break;
				}
			}
		}
	} else {
		adventure.roomCandidates = {
			"Final Battle": true
		};
	}

	// Generate current room
	if (adventure.depth < 11) {
		let roomTemplate = manufactureRoomTemplate(roomType, adventure);
		adventure.room = new Room(roomTemplate.title, roomTemplate.element);
		if (adventure.room.element === "@{adventure}") {
			adventure.room.element = adventure.element;
		} else if (adventure.room.element === "@{adventureWeakness}") {
			let weaknesses = getWeaknesses(adventure.element);
			adventure.room.element = weaknesses[generateRandomNumber(adventure, weaknesses.length, "general")];
		}
		let embed = new MessageEmbed().setColor(getColor(adventure.room.element))
			.setAuthor({ name: roomHeaderString(adventure), iconURL: thread.client.user.displayAvatarURL() })
			.setTitle(roomTemplate.title)
			.setDescription(roomTemplate.description.replace("@{roomElement}", adventure.room.element))
			.setFooter({ text: `Room #${adventure.depth}` });
		for (let resource in roomTemplate.resourceList) {
			let count = parseCount(roomTemplate.resourceList[resource], adventure.delvers.length);
			let resourceType;
			if (resource === "forgeSupplies") {
				embed.addField("Remaining Forge Supplies", count.toString());
				resourceType = "resource";
			}
			adventure.room.resources[resource] = new Resource(resource, resourceType, count, "resource", 0);
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
			const cloverCount = adventure.artifacts["Negative-One Leaf Clover"] || 0;
			for (let category in roomTemplate.saleList) {
				if (category.startsWith("weapon")) {
					let [type, tier] = category.split(SAFE_DELIMITER);
					let parsedTier = tier;
					let count = Math.min(25, parseCount(roomTemplate.saleList[category], adventure.delvers.length));
					for (let i = 0; i < count; i++) {
						if (tier === "?") {
							let threshold = 1 + cloverCount;
							let max = 8 + cloverCount;
							if (generateRandomNumber(adventure, max, "general") < threshold) {
								parsedTier = "2";
							} else {
								parsedTier = "1";
							}
						}
						let weaponName = rollWeaponDrop(parsedTier, adventure);
						if (adventure.room.resources[weaponName] && adventure.room.resources[weaponName].resourceType === "weapon") {
							adventure.room.resources[weaponName].count++;
						} else {
							adventure.room.resources[weaponName] = new Resource(weaponName, "weapon", 1, "merchant", getWeaponProperty(weaponName, "cost"))
								.setUIGroup(category);
						}
					}
				} else if (category === "scouting") {
					adventure.room.resources["bossScouting"] = new Resource("bossScouting", "scouting", true, "merchant", calculateScoutingCost(adventure, "Final Battle"))
						.setUIGroup("scouting");
					adventure.room.resources["guardScouting"] = new Resource("guardScouting", "scouting", true, "merchant", calculateScoutingCost(adventure, "Artifact Guardian"))
						.setUIGroup("scouting");
				}
			}
			let roomMessage = await thread.send({
				embeds: [embed.addField("Decide the next room", "Each delver can pick or change their pick for the next room. The party will move on when the decision is unanimous.")],
				components: [...roomTemplate.uiRows, ...exports.generateMerchantRows(adventure), exports.generateRoutingRow(adventure)]
			});
			adventure.messageIds.room = roomMessage.id;
		}
		exports.setAdventure(adventure);
	} else {
		adventure.accumulatedScore = 10;
		thread.send({
			embeds: [exports.completeAdventure(adventure, thread, { isSuccess: true, description: null })],
			components: [new MessageActionRow().addComponents(
				new MessageButton().setCustomId("collectartifact")
					.setLabel("Collect Artifact")
					.setStyle("SUCCESS")
			)]
		})
	}
}

function calculateScoutingCost({ artifacts: { "Amethyst Spyglass": amethystSpyglassCount = 0 } }, type) {
	switch (type) {
		case "Final Battle":
			return 150 - ((amethystSpyglassCount) * 5);
		case "Artifact Guardian":
			return 100 - ((amethystSpyglassCount) * 5);
	}
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
			// Clear Excess Block
			clearBlock(combatant);

			// Roll Round Speed
			let percentBonus = (generateRandomNumber(adventure, 21, "Battle") - 10) / 100;
			combatant.roundSpeed = Math.floor(combatant.speed * percentBonus);

			// Roll Critical Hit
			let critRoll = generateRandomNumber(adventure, 4, "Battle");
			combatant.crit = critRoll > 2;

			// Roll Enemy Moves and Generate Dummy Moves
			let move = new Move()
				.setSpeed(combatant)
				.setIsCrit(combatant.crit)
				.setUser(teamName, i)
			if (combatant.modifiers.Stun > 0) {
				// Dummy move for Stunned combatants
				move.setMoveName("Stun");
			} else {
				if (teamName === "enemy") {
					if (combatant.lookupName !== "@{clone}") {
						let enemyTemplate = getEnemy(combatant.lookupName);
						let actionName = combatant.nextAction;
						if (actionName === "random") {
							let actionPool = Object.keys(enemyTemplate.actions);
							actionName = actionPool[generateRandomNumber(adventure, actionPool.length, "Battle")];
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
				removeModifier(combatant, { name: modifier, stacks: getTurnDecrement(modifier) })
			}
		})
	}

	embed.setColor(getColor(adventure.room.element))
		.setFooter({ text: `Room #${adventure.depth} - Round ${adventure.room.round}` });
	if (!exports.checkNextRound(adventure)) {
		let battleMenu = [new MessageActionRow().addComponents(
			new MessageButton().setCustomId("predict")
				.setLabel("Predict")
				.setStyle("SECONDARY"),
			new MessageButton().setCustomId("readymove")
				.setLabel("Ready a Move")
				.setStyle("PRIMARY")
		)];
		thread.send({ embeds: [embed], components: battleMenu }).then(message => {
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

exports.generateRoutingRow = function (adventure) {
	let candidateKeys = Object.keys(adventure.roomCandidates);
	if (candidateKeys.length > 1) {
		return new MessageActionRow().addComponents(
			...candidateKeys.map(roomType => {
				return new MessageButton().setCustomId(`routevote${SAFE_DELIMITER}${roomType}`)
					.setLabel(`Next room: ${roomType}`)
					.setStyle("SECONDARY")
			}));
	} else {
		return new MessageActionRow().addComponents(
			new MessageButton().setCustomId("continue")
				.setLabel(`Continue to the ${candidateKeys[0]}`)
				.setStyle("SECONDARY")
		);
	}
}

exports.generateLootRow = function (adventure) {
	let options = [];
	for (const resource of Object.values(adventure.room.resources)) {
		if (resource.uiType === "loot") {
			const { name, resourceType: type, count } = resource;
			let option = { value: `${name}${SAFE_DELIMITER}${options.length}` };

			if (name == "gold") {
				option.label = `${count} Gold`;
			} else {
				option.label = `${name} x ${count}`;
			}

			if (type === "weapon") {
				option.description = buildWeaponDescription(name, false);
			} else if (type === "artifact") {
				option.description = getArtifact(name).dynamicDescription(count);
			} else {
				option.description = "";
			}
			options.push(option)
		}
	}
	if (options.length > 0) {
		return new MessageActionRow().addComponents(
			new MessageSelectMenu().setCustomId("loot")
				.setPlaceholder("Take some of the spoils of combat...")
				.setOptions(options))
	} else {
		return new MessageActionRow().addComponents(
			new MessageSelectMenu().setCustomId("loot")
				.setPlaceholder("No loot")
				.setOptions([{ label: "If the menu is stuck, close and reopen the thread.", description: "This usually happens when two players try to take the last thing at the same time.", value: "placeholder" }])
				.setDisabled(true)
		)
	}
}

exports.generateMerchantRows = function (adventure) {
	let categorizedResources = {};
	for (const resource of Object.values(adventure.room.resources)) {
		if (resource.uiType === "merchant") {
			let group = resource.uiGroup;
			if (categorizedResources[group]) {
				categorizedResources[group].push(resource.name);
			} else {
				categorizedResources[group] = [resource.name];
			}
		}
	}

	let rows = [];
	for (const groupName in categorizedResources) {
		if (groupName.startsWith("weapon")) {
			const [type, tier] = groupName.split(SAFE_DELIMITER);
			let options = [];
			categorizedResources[groupName].forEach((resource, i) => {
				if (adventure.room.resources[resource].count > 0) {
					const cost = getWeaponProperty(resource, "cost");
					options.push({
						label: `${cost}g: ${resource}`,
						description: buildWeaponDescription(resource, false),
						value: `${resource}${SAFE_DELIMITER}${i}`
					})
				}
			})
			if (options.length) {
				rows.push(new MessageActionRow().addComponents(
					new MessageSelectMenu().setCustomId(`buy${groupName}`)
						.setPlaceholder(`Check a ${tier === "2" ? "rare " : ""}weapon...`)
						.setOptions(options)));
			} else {
				rows.push(new MessageActionRow().addComponents(
					new MessageSelectMenu().setCustomId(`buy${groupName}`)
						.setPlaceholder("SOLD OUT")
						.setOptions([{ label: "If the menu is stuck, close and reopen the thread.", description: "This usually happens when two players try to buy the last weapon at the same time.", value: "placeholder" }])
						.setDisabled(true)));
			}
		} else if (groupName === "scouting") {
			const bossScoutingCost = calculateScoutingCost(adventure, "Final Battle");
			const guardScoutingCost = calculateScoutingCost(adventure, "Artifact Guardian");
			rows.push(new MessageActionRow().addComponents(
				new MessageButton().setCustomId(`buyscouting${SAFE_DELIMITER}Final Battle`)
					.setLabel(`${adventure.scouting.finalBoss ? `Final Battle: ${adventure.finalBoss}` : `${bossScoutingCost}g: Scout the Final Battle`}`)
					.setStyle("SECONDARY")
					.setDisabled(adventure.scouting.finalBoss || adventure.gold < bossScoutingCost),
				new MessageButton().setCustomId(`buyscouting${SAFE_DELIMITER}Artifact Guardian`)
					.setLabel(`${guardScoutingCost}g: Scout the ${ordinalSuffixEN(adventure.scouting.artifactGuardians + 1)} Artifact Guardian`)
					.setStyle("SECONDARY")
					.setDisabled(adventure.gold < guardScoutingCost)
			));
		}
	}
	return rows;
}

exports.endRound = async function (adventure, thread) {
	// Generate results embed
	let embed = new MessageEmbed().setAuthor({ name: roomHeaderString(adventure), iconURL: thread.client.user.displayAvatarURL() })
		.setTitle(adventure.room.title);

	// Generate Reactive Moves by Enemies
	adventure.room.enemies.forEach((enemy, index) => {
		if (enemy.lookupName === "@{clone}") {
			let move = new Move()
				.setSpeed(enemy)
				.setIsCrit(enemy.crit)
			let counterpartMove = adventure.room.moves.find(move => move.userTeam === "delver" && move.userIndex == index);
			move.setUser("clone", index)
				.setMoveName(counterpartMove.name);
			counterpartMove.targets.forEach(target => {
				if (target.team === "enemy") {
					move.addTarget("delver", target.index);
				} else {
					move.addTarget("enemy", target.index);
				}
			})
			adventure.room.moves.splice(adventure.room.moves.findIndex(move => move.userTeam === "enemy" && move.userIndex == index), 1, move);
		}
	})

	// Resolve moves
	adventure.room.moves.forEach(move => {
		// Randomize speed ties
		move.speed += generateRandomNumber(adventure, 10, "battle") / 10;
	})
	adventure.room.moves.sort((first, second) => {
		return second.speed - first.speed;
	})
	let lastRoundText = "";
	for (let move of adventure.room.moves) {
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

			// Weapon drops
			let dropThreshold = 1;
			let dropMax = 8;
			if (generateRandomNumber(adventure, dropMax, "general") < dropThreshold) {
				const cloverCount = adventure.artifacts["Negative-One Leaf Clover"] || 0;
				let tier = 1;
				let upgradeThreshold = 1 + cloverCount;
				let upgradeMax = 8 + cloverCount;
				if (generateRandomNumber(adventure, upgradeMax, "general") < upgradeThreshold) {
					tier = 2;
				}
				let droppedWeapon = rollWeaponDrop(tier, adventure);
				if (adventure.room.resources[droppedWeapon]) {
					adventure.room.resources[droppedWeapon].count++;
				} else {
					adventure.room.resources[droppedWeapon] = new Resource(droppedWeapon, "weapon", 1, "loot", 0);
				}
			}

			// Decrement Challenge Duration
			for (const challengeName in adventure.challenges) {
				if (adventure.challenges[challengeName].duration) {
					adventure.challenges[challengeName].duration--;
					if (adventure.challenges[challengeName].duration < 1) {
						getChallenge(challengeName).reward(adventure);
					}
				}
			}

			// Finalize UI
			return thread.send({
				embeds: [embed.setTitle("Victory!")
					.setDescription(lastRoundText)
					.addField("Decide the next room", "Each delver can pick or change their pick for the next room. The party will move on when the decision is unanimous.")],
				components: [exports.generateLootRow(adventure), exports.generateRoutingRow(adventure)]
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
		}
	}
	adventure.room.moves = [];
	exports.newRound(adventure, thread, embed.setDescription(lastRoundText));
}

exports.checkNextRound = function (adventure) {
	return adventure.room.moves.length - adventure.room.enemies.length === adventure.delvers.length;
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
	if (adventure.messageIds.utility) {
		thread.messages.delete(adventure.messageIds.utility);
	}
	if (adventure.messageIds.leaderNotice) {
		thread.messages.delete(adventure.messageIds.leaderNotice);
	}

	adventure.state = "completed";
	exports.setAdventure(adventure);
	return scoreEmbed;
}

function saveAdventures() {
	ensuredPathSave("./Saves", "adventures.json", JSON.stringify(Array.from(adventureDictionary.values())));
}
