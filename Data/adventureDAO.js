const fs = require("fs");
const { ensuredPathSave, parseCount } = require("../helpers.js");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const Adventure = require("../Classes/Adventure.js");
const { setPlayer, getPlayer } = require("./playerDAO.js");
const { roomDictionary } = require("./Rooms/_roomDictionary.js");
const Move = require("../Classes/Move.js");
const { resolveMove } = require("./moveDAO.js");
const Enemy = require("../Classes/Enemy.js");
const { clearBlock } = require("./combatantDAO.js");
const Delver = require("../Classes/Delver.js");
const { getTurnDecrement } = require("./Modifiers/_modifierDictionary.js");
const Room = require("../Classes/Room.js");

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
					let castEnemies = [];
					for (let enemy of adventure.room.enemies) {
						castEnemies.push(Object.assign(new Enemy(), enemy));
					}
					adventure.room.enemies = castEnemies;

					// Cast moves into Move class
					let castMoves = [];
					for (let move of adventure?.room.moves) {
						castMoves.push(Object.assign(new Move(), move));
					}
					adventure.room.moves = castMoves;
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

exports.generateRandomNumber = function (adventure, exclusiveMax, branch) {
	if (exclusiveMax === 1) {
		return 0;
	} else {
		let digits = Math.ceil(Math.log2(exclusiveMax) / Math.log2(12));
		let start;
		let end;
		switch (branch) {
			case "general":
				start = adventure.rnIndex;
				end = start + digits;
				adventure.rnIndex = end % adventure.rnTable.length;
				break;
			case "battle":
				start = adventure.rnIndexBattle;
				end = start + digits;
				adventure.rnIndexBattle = end % adventure.rnTable.length;
				break;
		}
		let max = 12 ** digits;
		let sectionLength = max / exclusiveMax;
		let roll = parseInt(adventure.rnTable.slice(start, end), 12);
		return Math.floor(roll / sectionLength);
	}
}

exports.nextRoom = function (adventure, channel) {
	adventure.depth++;
	if (adventure.messageIds.lastComponent) {
		channel.messages.fetch(adventure.messageIds.lastComponent).then(message => {
			message.edit({ components: [] });
		}).catch(console.error);
	}
	if (adventure.depth < 11) {
		let preRolledDepths = [10];
		let roomTemplate;
		if (preRolledDepths.includes(adventure.depth)) {
			// Prerolled Room
			roomTemplate = roomDictionary[adventure.finalBoss];
		} else {
			// Non-prerolled Room
			let roomPool = Object.values(roomDictionary); //TODO #53 refactor room selector AI
			roomTemplate = roomPool[exports.generateRandomNumber(adventure, roomPool.length, "general")];
		}
		let totalEnemyCount = 1;
		for (let enemy in roomTemplate.enemyList) {
			totalEnemyCount *= parseCount(roomTemplate.enemyList[enemy], adventure.delvers.length);
		}
		let hpRNs = [];
		for (let i = 0; i < totalEnemyCount; i++) {
			hpRNs.push(exports.generateRandomNumber(adventure, 4, "battle"));
		}
		Object.assign(new Room(), roomTemplate)
			.populate(adventure, hpRNs).then(room => {
				adventure.room = room;
				let embed = new MessageEmbed()
					.setAuthor(`Lives: ${adventure.lives} - Party Gold: ${adventure.gold} - Score: ${adventure.accumulatedScore}`, channel.client.user.displayAvatarURL())
					.setTitle(room.title)
					.setDescription(room.description)
					.setFooter(`Room #${adventure.depth}`);
				if (room.type === "battle" || room.type.endsWith("boss")) {
					exports.newRound(adventure, channel, embed);
					exports.saveAdventures();
				} else {
					channel.send({ embeds: [embed], components: room.components }).then(message => {
						adventure.setMessageId("lastComponent", message.id);
						exports.saveAdventures();
					});
				}
			})
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
			let percentBonus = (exports.generateRandomNumber(adventure, 21, "battle") - 10) / 100;
			combatant.roundSpeed = Math.floor(combatant.speed * percentBonus);

			// Roll Critical Hit
			let critRoll = exports.generateRandomNumber(adventure, 4, "battle");
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
						let actionPool = [];
						Object.values(combatant.actions).forEach(action => {
							for (let i = 0; i < action.weight; i++) {
								actionPool.push(action);
							}
						})
						if (actionPool.length) {
							//TODO #19 nonrandom AI
							move.setMoveName(actionPool[exports.generateRandomNumber(adventure, actionPool.length, "battle")].name)
								.addTarget("ally", exports.generateRandomNumber(adventure, adventure.delvers.length, "battle"));
						}
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

	embed.setFooter(`Room #${adventure.depth} - Round ${adventure.room.round}`);
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

exports.endRound = async function (adventure, channel) {
	// Generate results embed
	let embed = new MessageEmbed().setAuthor(`Lives: ${adventure.lives} - Party Gold: ${adventure.gold} - Score: ${adventure.accumulatedScore}`, channel.client.user.displayAvatarURL())
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
	adventure.room.moves.sort((first, second) => {
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
			totalBounty *= (90 + exports.generateRandomNumber(adventure, 21, "general")) / 100;
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
						//TODO relic drops
					}
				}
			}

			// Finalize UI
			let componentContainer = [new MessageActionRow().addComponents(
				new MessageButton().setCustomId("continue")
					.setLabel("Move on")
					.setStyle("PRIMARY")
			)];
			if (lootRow.length > 0) {
				embed.addField("Spoils of Combat", spoilsText);
				componentContainer.unshift(new MessageActionRow().addComponents(...lootRow));
			}

			return channel.send({
				embeds: [embed.setTitle("Victory!").setDescription(lastRoundText)],
				components: componentContainer
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
	let goldScore = Math.log10(adventure.gold) * 5; //TODO #84 base goldScore on peak gold instead of end gold
	if (isSuccess) {
		score += goldScore;
		score += adventure.accumulatedScore;
	} else {
		score += Math.floor(goldScore / 2);
		score += Math.floor(adventure.accumulatedScore / 2);
	}
	embed.addField("Score Breakdown", `Depth: ${adventure.depth}\nGold: ${goldScore}${isSuccess ? "" : ` ÷ 2  = ${Math.floor(goldScore / 2)} (Defeat)`}\nBonus: ${adventure.accumulatedScore}${isSuccess ? "" : ` ÷ 2  = ${Math.floor(adventure.accumulatedScore / 2)} (Defeat)`}\n__Total__: ${score}`)
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
