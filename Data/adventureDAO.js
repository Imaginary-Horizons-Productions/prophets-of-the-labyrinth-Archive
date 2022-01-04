const fs = require("fs");
const { ensuredPathSave, parseCount, generateRandomNumber, clearComponents } = require("../helpers.js");
const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require("discord.js");
const Adventure = require("../Classes/Adventure.js");
const { setPlayer, getPlayer } = require("./playerDAO.js");
const { getRoomTemplate, prerollBoss } = require("./Rooms/_roomDictionary.js");
const Move = require("../Classes/Move.js");
const { resolveMove } = require("./moveDAO.js");
const Enemy = require("../Classes/Enemy.js");
const { clearBlock } = require("./combatantDAO.js");
const Delver = require("../Classes/Delver.js");
const { getTurnDecrement } = require("./Modifiers/_modifierDictionary.js");
const { getEnemy } = require("./Enemies/_enemyDictionary");
const Room = require("../Classes/Room.js");
const { spawnEnemy } = require("./enemyDAO.js");
const { getWeaknesses, getColor } = require("./elementHelpers.js");
const { rollWeaponDrop, getWeaponProperty } = require("./Weapons/_weaponDictionary.js");
const { weaponToEmbedField } = require("./weaponDAO.js");

var filePath = "./Saves/adventures.json";
var requirePath = "./../Saves/adventures.json";
var adventureDictionary = new Map();

exports.loadAdventures = function () {
	return new Promise((resolve, reject) => {
		if (fs.existsSync(filePath)) {
			var adventures = require(requirePath);
			adventures.forEach(adventure => {
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
				adventureDictionary.set(adventure.id, Object.assign(new Adventure(adventure.initialSeed), adventure));
			})
		} else {
			if (!fs.existsSync("./Saves")) {
				fs.mkdirSync("./Saves", { recursive: true });
			}
			fs.writeFile(filePath, "[]", "utf8", error => {
				if (error) {
					console.error(error);
				}
			})
		}
		resolve(`${adventures.length} adventures loaded`);
	})
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
	let roomTypes = ["Battle", "Event", "Forge", "Rest Site", "Artifact Guardian"]; //TODO #126 add weights to room types
	let finalBossDepths = [10];
	let candidateType = "";
	if (!finalBossDepths.includes(adventure.depth + 1)) {
		adventure.roomCandidates = {};
		let numCandidates = 2 + adventure.artifacts["Enchanted Map"] || 0;
		for (let i = 0; i < numCandidates; i++) {
			candidateType = roomTypes[generateRandomNumber(adventure, roomTypes.length, "General")];
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
		let roomTemplate = getRoomTemplate(roomType, adventure);
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
		for (let reward in roomTemplate.lootList) {
			let rewardCount = parseCount(roomTemplate.lootList[reward], adventure.delvers.length);
			if (reward === "forgeSupplies") {
				embed.addField("Remaining Forge Supplies", rewardCount.toString());
			}
			adventure.room.loot[reward] = rewardCount;
		}
		if (["Battle", "Artifact Guardian", "Final Battle"].includes(roomType)) {
			// Generate combat room
			if (roomType === "Artifact Guardian") {
				adventure.scouting.artifactGuardiansEncountered++;
				while (adventure.artifactGuardians.length <= adventure.scouting.artifactGuardiansEncountered) {
					prerollBoss("Relic Guardian", adventure);
				}
			}
			adventure.room.initializeCombatProperties();
			let isBossRoom = roomType !== "Battle";
			for (let enemyName in roomTemplate.enemyList) {
				for (let i = 0; i < parseCount(roomTemplate.enemyList[enemyName], adventure.delvers.length); i++) {
					spawnEnemy(adventure, getEnemy(enemyName), !isBossRoom);
				}
			}
			exports.newRound(adventure, thread, embed);
		} else {
			// Generate non-combat room
			let uiComponents = [...roomTemplate.uiRows];
			for (let category in roomTemplate.saleList) {
				if (category.startsWith("weapon")) {
					let tier = category.split("-")[1];
					let parsedTier = tier;
					let count = Math.min(25, parseCount(roomTemplate.saleList[category], adventure.delvers.length));
					let weaponOptions = [];
					for (let i = 0; i < count; i++) {
						if (tier === "?") {
							let threshold = 1;
							let max = 8;
							if (generateRandomNumber(adventure, max, "general") < threshold) {
								parsedTier = 2;
							} else {
								parsedTier = 1;
							}
						}
						let weaponName = rollWeaponDrop(adventure.delvers.map(delver => delver.element), parsedTier, adventure);
						let cost = getWeaponProperty(weaponName, "cost");
						if (adventure.room.loot[weaponName]) {
							adventure.room.loot[weaponName]++;
						} else {
							adventure.room.loot[weaponName] = 1;
						}
						weaponOptions.push({
							label: `${cost}g: ${weaponName}`,
							description: weaponToEmbedField(weaponName, 0)[1].split("\n")[0].replace(/\*/g, ""),
							value: `${weaponName}-${i}-${cost}`
						})
					}
					uiComponents.push(new MessageActionRow().addComponents(
						new MessageSelectMenu().setCustomId(`buyweapon-${tier}`)
							.setPlaceholder(`Check a ${tier === "2" ? "rare " : ""}weapon...`)
							.setOptions(weaponOptions)));
				} else if (category === "scouting") {
					let bossScoutingCost = 150;
					let guardScoutingCost = 100;
					uiComponents.push(new MessageActionRow().addComponents(
						new MessageButton().setCustomId(`buyscouting-finalbattle-${bossScoutingCost}`)
							.setLabel(`${adventure.scouting.finalBoss ? `Final Battle: ${adventure.finalBoss}` : `${bossScoutingCost}g: Scout the Final Battle`}`)
							.setStyle("SECONDARY")
							.setDisabled(adventure.scouting.finalBoss || adventure.gold < bossScoutingCost),
						new MessageButton().setCustomId(`buyscouting-artifactguardian-${guardScoutingCost}`)
							.setLabel(`${guardScoutingCost}g: Scout an Artifact Guardian (${adventure.scouting.artifactGuardians} so far)`)
							.setStyle("SECONDARY")
					));
				}
			}
			const { embed: embedFinal, uiRows } = addRoutingUI(embed, uiComponents, adventure);
			let roomMessage = await thread.send({ embeds: [embedFinal], components: uiRows });
			adventure.messageIds.room = roomMessage.id;
		}
		exports.setAdventure(adventure);
	} else {
		adventure.accumulatedScore = 10;
		exports.completeAdventure(adventure, thread, new MessageEmbed().setTitle("Success"));
	}
}

exports.newRound = function (adventure, thread, embed = new MessageEmbed()) {
	// Increment round and clear last round's components
	adventure.room.round++;
	clearComponents(adventure.messageIds.battleRound, thread.messages);

	// Logistics for Next Round
	let teams = {
		"enemy": adventure.room.enemies,
		"ally": adventure.delvers
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
				move.setMoveName("Stun")
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
			for (let modifierName in combatant.modifiers) {
				combatant.modifiers[modifierName] -= getTurnDecrement(modifierName);

				if (combatant.modifiers[modifierName] <= 0) {
					delete combatant.modifiers[modifierName];
				}
			}
		})
	}

	embed.setColor(adventure.room.embedColor)
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

function addRoutingUI(embed, components, adventure) {
	let candidateKeys = Object.keys(adventure.roomCandidates);
	let uiRows = [...components];
	if (candidateKeys.length > 1) {
		uiRows.push(new MessageActionRow().addComponents(
			...candidateKeys.map(roomType => {
				return new MessageButton().setCustomId(`routevote-${roomType}`)
					.setLabel(`Next room: ${roomType}`)
					.setStyle("SECONDARY")
			})));
		embed.addField("Decide the next room", "Each delver can pick or change their pick for the next room. The party will move on when the decision is unanimous.");
	} else {
		uiRows.push(new MessageActionRow().addComponents(
			new MessageButton().setCustomId("continue")
				.setLabel(`Continue to the ${candidateKeys[0]}`)
				.setStyle("SECONDARY")
		));
	}

	return { embed, uiRows };
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
			let counterpartMove = adventure.room.moves.find(move => move.userTeam === "ally" && move.userIndex == index);
			move.setUser("clone", index)
				.setMoveName(counterpartMove.name);
			counterpartMove.targets.forEach(target => {
				if (target.team === "enemy") {
					move.addTarget("ally", target.index);
				} else {
					move.addTarget("enemy", target.index);
				}
			})
			adventure.room.moves.splice(adventure.room.moves.findIndex(move => move.userTeam === "enemy" && move.userIndex == index), 1, move);
		}
	})

	// Resolve moves
	adventure.room.moves.sort((first, second) => { //TODO #106 randomize speed ties
		return second.speed - first.speed;
	})
	let lastRoundText = "";
	for (let move of adventure.room.moves) {
		lastRoundText += await resolveMove(move, adventure);
		// Check for Defeat
		if (adventure.lives <= 0) {
			exports.completeAdventure(adventure, thread, embed.setTitle("Defeat").setDescription(lastRoundText));
			return;
		}

		// Check for Victory
		if (adventure.room.enemies.every(enemy => enemy.hp === 0)) {
			let lootRow = [];

			// Generate gold
			let totalBounty = adventure.room.enemies.reduce((total, enemy) => total + enemy.bounty, adventure.room.loot.gold);
			totalBounty *= (90 + generateRandomNumber(adventure, 21, "General")) / 100;
			totalBounty = Math.ceil(totalBounty);
			adventure.room.loot.gold = totalBounty;
			if (totalBounty > 0) {
				lootRow.push(new MessageButton().setCustomId("takegold")
					.setLabel(`Take ${totalBounty} gold`)
					.setStyle("SUCCESS")
				)
			}

			// Weapon drops
			let dropThreshold = 1;
			let dropMax = 8;
			if (generateRandomNumber(adventure, dropMax, "general") < dropThreshold) {
				let tier = 1;
				let upgradeThreshold = 1;
				let upgradeMax = 8;
				if (generateRandomNumber(adventure, upgradeMax, "general") < upgradeThreshold) {
					tier = 2;
				}
				let droppedWeapon = rollWeaponDrop(adventure.delvers.map(delver => delver.element), tier, adventure);
				adventure.room.loot[`weapon-${droppedWeapon}`] = 1;
			}
			if (Object.keys(adventure.room.loot).length - 1 > 0) {
				for (let item in adventure.room.loot) {
					let itemName = "";
					if (item.startsWith("weapon-")) {
						itemName = item.split("-")[1];
						let label = `${itemName} x${adventure.room.loot[item]}`;
						lootRow.push(new MessageButton().setCustomId(`takeweapon-${itemName}`)
							.setLabel(`${label} remaining`)
							.setStyle("PRIMARY"))
					} else if (item.startsWith("artifact-")) {
						itemName = item.split("-")[1];
						//TODO #101 artifact drops
					}
				}
			}

			// Finalize UI
			let roomUI = [];
			if (lootRow.length > 0) {
				roomUI.unshift(new MessageActionRow().addComponents(...lootRow));
			}
			const { embed: embedFinal, uiRows } = addRoutingUI(embed, roomUI, adventure);
			return thread.send({
				embeds: [embedFinal.setTitle("Victory!").setDescription(lastRoundText)],
				components: uiRows
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

exports.completeAdventure = function (adventure, thread, scoreEmbed) {
	let isSuccess = scoreEmbed.title === "Success";
	let score = adventure.depth;
	let livesScore = adventure.lives * 10;
	let goldScore = Math.log10(adventure.peakGold) * 5;
	score += livesScore;
	score += goldScore;
	score += adventure.accumulatedScore;
	if (!isSuccess) {
		score = Math.floor(score / 2);
	}
	score = Math.max(1, score);
	scoreEmbed.addField("Score Breakdown", `Depth: ${adventure.depth}\nLives: ${livesScore}\nGold: ${goldScore}\nBonus: ${adventure.accumulatedScore}\n\n__Total__: ${!isSuccess && score > 0 ? `score ÷ 2  = ${score} (Defeat)` : score}`);

	adventure.delvers.forEach(delver => {
		let player = getPlayer(delver.id, thread.guildId);
		let previousScore = player.scores[thread.guildId];
		if (previousScore) {
			player.scores[thread.guildId] += score;
		} else {
			player.scores[thread.guildId] = score;
		}
		setPlayer(player);
	})

	thread.fetchStarterMessage({ cache: false, force: true }).then(recruitMessage => {
		let recruitEmbed = recruitMessage.embeds[0];
		recruitEmbed.setTitle(recruitEmbed.title + ": COMPLETE!")
			.setThumbnail("https://cdn.discordapp.com/attachments/545684759276421120/734092918369026108/completion.png")
			.addField("Seed", adventure.initialSeed);
		recruitMessage.edit({ embeds: [recruitEmbed] });
	})
	clearComponents(adventure.messageIds.battleRound, thread.messages);
	clearComponents(adventure.messageIds.room, thread.messages);
	if (adventure.messageIds.utility) {
		thread.messages.delete(adventure.messageIds.utility);
		delete adventure.messageIds.utility;
	}
	if (adventure.messageIds.leaderNotice) {
		thread.messages.delete(adventure.messageIds.leaderNotice);
		delete adventure.messageIds.leaderNotice;
	}

	adventureDictionary.delete(thread.id);
	saveAdventures();
	thread.send({ embeds: [scoreEmbed] });
}

function saveAdventures() {
	ensuredPathSave("./Saves", "adventures.json", JSON.stringify(Array.from(adventureDictionary.values())));
}
