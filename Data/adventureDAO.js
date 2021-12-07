const fs = require("fs");
const { ensuredPathSave, parseCount, generateRandomNumber } = require("../helpers.js");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const Adventure = require("../Classes/Adventure.js");
const { setPlayer, getPlayer } = require("./playerDAO.js");
const { getRoomTemplate } = require("./Rooms/_roomDictionary.js");
const Move = require("../Classes/Move.js");
const { resolveMove } = require("./moveDAO.js");
const Enemy = require("../Classes/Enemy.js");
const { clearBlock } = require("./combatantDAO.js");
const Delver = require("../Classes/Delver.js");
const { getTurnDecrement } = require("./Modifiers/_modifierDictionary.js");
const { getEnemy } = require("./Enemies/_enemyDictionary");
const Room = require("../Classes/Room.js");
const RoomCombat = require("../Classes/RoomCombat.js");
const { getGuild } = require("./guildDAO.js");
const { spawnEnemy } = require("./enemyDAO.js");
const DamageType = require("../Classes/DamageType.js");

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
	exports.saveAdventures();
}

exports.updateStartingMessage = function (startMessage, adventure) {
	let embed = startMessage.embeds[0];
	let partyList = `Leader: <@${adventure.leaderId}>`;
	for (let i = 0; i < adventure.delvers.length; i++) {
		if (adventure.delvers[i].id !== adventure.leaderId) {
			partyList += `\n<@${adventure.delvers[i].id}>`;
		}
	}
	embed.spliceFields(0, 1, { name: `${adventure.delvers.length} Party Member${adventure.delvers.length == 1 ? "" : "s"}`, value: partyList });
	startMessage.edit({ embeds: [embed] });
}

function roomHeaderString(adventure) {
	return `Lives: ${adventure.lives} - Party Gold: ${adventure.gold} - Score: ${adventure.accumulatedScore}`;
}

exports.updateRoomHeader = function (adventure, message) {
	message.edit({ embeds: [message.embeds[0].setAuthor(roomHeaderString(adventure), message.client.user.displayAvatarURL())] })
}

exports.nextRoom = async function (roomType, adventure, channel) {
	// Clean up old room
	adventure.depth++;
	adventure.room = {};
	if (adventure.messageIds.lastComponent) {//TODO #127 leave events and route components, but remove battle components
		channel.messages.fetch(adventure.messageIds.lastComponent).then(message => {
			message.edit({ components: [] });
		}).catch(console.error);
	}

	// Roll options for next room type
	let roomTypes = ["Battle", "Event", "Forge", "Rest Site"]; //TODO #126 add weights to room types
	let finalBossDepths = [10];
	let candidateType = "";
	if (!finalBossDepths.includes(adventure.depth + 1)) {
		adventure.roomCandidates = {};
		let numCandidates = 2; // Should not execed 5, as only 5 buttons can be in a MessageActionRow
		for (let i = 0; i < numCandidates; i++) {
			candidateType = roomTypes[generateRandomNumber(adventure, roomTypes.length, "General")];
			adventure.roomCandidates[candidateType] = [];
			roomTypes = roomTypes.filter(type => type != candidateType);
		}
	} else {
		adventure.roomCandidates = {
			"Final Battle": true
		};
	}

	// Generate current room
	if (adventure.depth < 11) {
		let roomTemplate = getRoomTemplate(roomType, adventure);
		let roomColor = roomTemplate.element;
		if (roomColor === "@{adventure}") {
			roomColor = DamageType.getColor(adventure.element);
		} else {
			roomColor = DamageType.getColor(roomColor);
		}
		let embed = new MessageEmbed().setColor(roomColor)
			.setAuthor(roomHeaderString(adventure), channel.client.user.displayAvatarURL())
			.setTitle(roomTemplate.title)
			.setDescription(roomTemplate.description)
			.setFooter(`Room #${adventure.depth}`);
		if (["Battle", "Final Battle", "Relic Guardian"].includes(roomType)) {
			if (roomType === "Relic Guardian") {
				adventure.scouting.relicGuardiansEncountered++;
			}
			adventure.room = new RoomCombat(roomTemplate.title, roomColor);
			let isBossRoom = roomType !== "Battle";
			for (let enemyName in roomTemplate.enemyList) {
				for (let i = 0; i < parseCount(roomTemplate.enemyList[enemyName], adventure.delvers.length); i++) {
					spawnEnemy(adventure, getEnemy(enemyName), !isBossRoom);
				}
			}
			exports.newRound(adventure, channel, embed);
		} else {
			adventure.room = new Room(roomTemplate.title, roomColor);
			const { embed: embedFinal, uiRows } = exports.addRoutingUI(embed, roomTemplate.uiRows, adventure);
			let message = await channel.send({ embeds: [embedFinal], components: uiRows });
			adventure.setMessageId("lastComponent", message.id);
		}
		for (let reward in roomTemplate.lootList) {
			adventure.room.loot[reward] = parseCount(roomTemplate.lootList[reward], adventure.delvers.length);
		}
		exports.saveAdventures();
	} else {
		adventure.accumulatedScore = 10;
		exports.completeAdventure(adventure, channel, new MessageEmbed().setTitle("Success"));
	}
}

exports.newRound = function (adventure, channel, embed = new MessageEmbed()) {
	// Increment round and clear last round's components
	adventure.room.round++;
	if (adventure.messageIds.lastComponent) {
		channel.messages.fetch(adventure.messageIds.lastComponent).then(message => {
			message.edit({ components: [] });
		})
	}

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
		.setFooter(`Room #${adventure.depth} - Round ${adventure.room.round}`);
	if (!exports.checkNextRound(adventure)) {
		embed.addField(`0/${adventure.delvers.length} Moves Readied`, "Ready party members will be listed here");
		let battleMenu = [new MessageActionRow().addComponents(
			new MessageButton().setCustomId("predict")
				.setLabel("Predict")
				.setStyle("SECONDARY"),
			new MessageButton().setCustomId("readymove")
				.setLabel("Ready a Move")
				.setStyle("PRIMARY")
		)];
		channel.send({ embeds: [embed], components: battleMenu }).then(message => {
			exports.updateRoomHeader(adventure, message);
			adventure.setMessageId("lastComponent", message.id);
			exports.saveAdventures();
		});
	} else {
		channel.send({ embeds: [embed] });
		exports.endRound(adventure, channel);
		exports.saveAdventures();
	}
}

exports.updateRoundMessage = function (messageManager, adventure) {
	messageManager.fetch(adventure.messageIds.lastComponent).then(roundMessage => {
		let embed = roundMessage.embeds[0];
		let readyList = "";
		for (var move of adventure.room.moves) {
			if (move.userTeam === "ally") {
				readyList += `\n<@${adventure.delvers[move.userIndex].id}>`;
			}
		}
		if (readyList === "") {
			readyList = "Ready party members will be listed here";
		}
		embed.spliceFields(0, 1, { name: `${adventure.room.moves.length - adventure.room.enemies.length}/${adventure.delvers.length} Moves Readied`, value: readyList });
		roundMessage.edit({ embeds: [embed] });
	})
}

exports.addRoutingUI = function (embed, components, adventure) {
	let candidateKeys = Object.keys(adventure.roomCandidates);
	let uiRows = [...components];
	if (candidateKeys.length > 1) {
		uiRows.push(new MessageActionRow().addComponents(
			...candidateKeys.map(roomType => {
				return new MessageButton().setCustomId(`routevote-${roomType}`)
					.setLabel(`Next room: ${roomType}`)
					.setStyle("SECONDARY")
			})));
		let delverIds = adventure.delvers.map(delver => delver.id);
		let allVotes = [].concat(...Object.values(adventure.roomCandidates));
		let notVoted = delverIds.filter(id => !allVotes.includes(id));
		embed.addField("Decide the next room",
			`Each delver can pick or change their pick for the next room. The party will move on when the decision is unanimous.\n\nUndecided:\n<@${notVoted.join(">, <@")}>`);
	} else {
		uiRows.push(new MessageActionRow().addComponents(
			new MessageButton().setCustomId("continue")
				.setLabel(`Continue to the ${roomType}`)
				.setStyle("SECONDARY")
		));
	}

	return { embed, uiRows };
}

exports.endRound = async function (adventure, channel) {
	// Generate results embed
	let embed = new MessageEmbed().setAuthor(roomHeaderString(adventure), channel.client.user.displayAvatarURL())
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
			exports.completeAdventure(adventure, channel, embed.setTitle("Defeat").setDescription(lastRoundText));
			return;
		}

		// Check for Victory
		if (adventure.room.enemies.every(enemy => enemy.hp === 0)) {
			let spoilsText = "";
			let lootRow = [];

			// Generate gold
			let totalBounty = adventure.room.enemies.reduce((total, enemy) => total + enemy.bounty, adventure.room.loot.gold);
			totalBounty *= (90 + generateRandomNumber(adventure, 21, "General")) / 100;
			totalBounty = Math.ceil(totalBounty);
			adventure.room.loot.gold = totalBounty;
			if (totalBounty > 0) {
				spoilsText += `${totalBounty > 0 ? `Gold: ${totalBounty}` : ""}`;
				lootRow.push(new MessageButton().setCustomId("takegold")
					.setLabel(`Take ${totalBounty} gold`)
					.setStyle("SUCCESS")
				)
			}

			// Weapon drops
			adventure.room.loot["weapon-Firecracker"] = 1;
			if (Object.keys(adventure.room.loot).length - 1 > 0) {
				for (let item in adventure.room.loot) {
					let itemName = "";
					if (item.startsWith("weapon-")) {
						itemName = item.split("-")[1];
						let label = `${itemName} x${adventure.room.loot[item]}`
						spoilsText += `\n${label}`;
						lootRow.push(new MessageButton().setCustomId(`takeweapon-${itemName}`)
							.setLabel(`${label} remaining`)
							.setStyle("PRIMARY"))
					} else if (item.startsWith("relic-")) {
						itemName = item.split("-")[1];
						//TODO #101 relic drops
					}
				}
			}

			// Finalize UI
			let roomUI = [];
			if (lootRow.length > 0) {
				embed.addField("Spoils of Combat", spoilsText);
				roomUI.unshift(new MessageActionRow().addComponents(...lootRow));
			}
			const { embed: embedFinal, uiRows } = exports.addRoutingUI(embed, roomUI, adventure);
			return channel.send({
				embeds: [embedFinal.setTitle("Victory!").setDescription(lastRoundText)],
				components: uiRows
			}).then(message => {
				adventure.room.moves = [];
				adventure.delvers.forEach(delver => {
					delver.modifiers = {};
				})
				return adventure;
			}).then(adventure => {
				exports.saveAdventures();
			});
		}
	}
	adventure.room.moves = [];
	exports.newRound(adventure, channel, embed.setDescription(lastRoundText));
}

exports.checkNextRound = function (adventure) {
	return adventure.room.moves.length - adventure.room.enemies.length === adventure.delvers.length;
}

//{channelId: guildId} A list of adventure channels that restarting the bot interrupted deleting
let completedAdventures = {};
exports.completeAdventure = function (adventure, channel, embed) {
	let isSuccess = embed.title === "Success";
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
	embed.addField("Score Breakdown", `Depth: ${adventure.depth}\nLives: ${livesScore}\nGold: ${goldScore}\nBonus: ${adventure.accumulatedScore}\n\n__Total__: ${!isSuccess && score > 0 ? `score ÷ 2  = ${score} (Defeat)` : score}`)
		.addField("Clean-Up", "This channel will be cleaned up in 5 minutes.");

	adventure.delvers.forEach(delver => {
		let player = getPlayer(delver.id, channel.guild.id);
		let previousScore = player.scores[channel.guild.id];
		if (previousScore) {
			player.scores[channel.guild.id] += score;
		} else {
			player.scores[channel.guild.id] = score;
		}
		setPlayer(player);
	})

	channel.guild.channels.fetch(getGuild(channel.guild.id).centralId).then(centralChannel => {
		return centralChannel.messages.fetch(adventure.messageIds.recruit);
	}).then(message => {
		let embed = message.embeds[0];
		embed.setTitle(embed.title + ": COMPLETE!")
			.setThumbnail("https://cdn.discordapp.com/attachments/545684759276421120/734092918369026108/completion.png");
		message.edit({ embeds: [embed] });
	})
	channel.messages.fetch(adventure.messageIds.lastComponent).then(message => {
		message.edit({ components: [] });
	})
	channel.messages.fetch(adventure.messageIds.utility).then(message => {
		message.edit({ components: [] });
	})

	adventureDictionary.delete(channel.id);
	exports.saveAdventures();
	completedAdventures[channel.id] = channel.guild.id;
	ensuredPathSave("./Saves", "completedAdventures.json", JSON.stringify(completedAdventures));
	setTimeout(() => {
		channel.delete("Adventure complete!");
		delete completedAdventures[channel.id];
		ensuredPathSave("./Saves", "completedAdventures.json", JSON.stringify(completedAdventures));
	}, 300000);
	channel.send({ embeds: [embed] });
}

exports.saveAdventures = function () {
	ensuredPathSave("./Saves", "adventures.json", JSON.stringify(Array.from(adventureDictionary.values())));
}
