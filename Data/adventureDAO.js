const fs = require("fs");
const { ensuredPathSave } = require("../helpers.js");
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
		resolve();
	})
}

exports.getAdventure = function (id) {
	return adventureDictionary.get(id);
}

exports.setAdventure = function (adventure) {
	adventureDictionary.set(adventure.id, adventure);
	exports.saveAdventures()
}

exports.updateStartingMessage = function (startMessage, adventure) {
	let embed = startMessage.embeds[0];
	let partyList = `Leader: <@${adventure.delvers[0].id}>`;
	for (let i = 1; i < adventure.delvers.length; i++) {
		partyList += `\n <@${adventure.delvers[i].id}>`;
	}
	embed.spliceFields(0, 1, { name: `${adventure.delvers.length} Party Member${adventure.delvers.length == 1 ? "" : "s"}`, value: partyList });
	startMessage.edit({ embeds: [embed] });
}

exports.nextRandomNumber = function (adventure, poolSize, branch) {
	let generated;
	let index;
	switch (branch) {
		case "general":
			index = adventure.rnIndex;
			adventure.rnIndex = (index + 1) % adventure.rnTable.length;
			break;
		case "battle":
			index = adventure.rnIndexBattle;
			adventure.rnIndexBattle = (index + 1) % adventure.rnTable.length;
			break;
	}
	let indexEnd = index + poolSize.toString().length;
	if (indexEnd < index) {
		generated = adventure.rnTable.slice(index) + adventure.rnTable.slice(0, indexEnd);
	} else {
		generated = adventure.rnTable.slice(index, indexEnd);
	}
	return generated % poolSize;
}

exports.nextRoom = function (adventure, channel) {
	adventure.depth++;
	if (adventure.messageIds.lastComponent) {
		channel.messages.fetch(adventure.messageIds.lastComponent).then(message => {
			message.edit({ components: [] });
		}).catch(console.error);
	}
	if (adventure.depth > 3) {
		adventure.accumulatedScore = 10;
		exports.completeAdventure(adventure, channel, "success");
	} else {
		let roomPool = Object.values(roomDictionary);
		Object.assign(new Room(), roomPool[exports.nextRandomNumber(adventure, roomPool.length, "general")])
			.populate(adventure.delvers.length).then(room => {
				adventure.room = room;
				let embed = new MessageEmbed()
					.setAuthor(`Entering Room #${adventure.depth}`, channel.client.user.displayAvatarURL())
					.setTitle(room.title)
					.setDescription(room.description);
				if (room.type === "battle") {
					exports.newRound(adventure, channel, embed);
					exports.saveAdventures();
				} else {
					channel.send({ embeds: [embed], components: room.components }).then(message => {
						adventure.setMessageId("lastComponent", message.id);
						exports.saveAdventures();
					});
				}
			})
	}
}

exports.newRound = function (adventure, channel, embed) {
	// Sort Soves by Speed
	adventure.room.moves.sort((first, second) => {
		return second.speed - first.speed;
	})

	// Resolve round's moves
	let lastRoundText = "";
	for (let i = 0; i < adventure.room.moves.length; i++) {
		lastRoundText += resolveMove(adventure.room.moves[i], adventure);
		if (adventure.lives <= 0) {
			exports.completeAdventure(adventure, channel, "defeat");
			break;
		}
	}
	adventure.room.moves = [];

	// Check for Victory
	if (adventure.room.enemies.every(enemy => enemy.hp === 0)) {
		channel.send({
			embeds: [new MessageEmbed()
				.setTitle("Victory!")
				.setDescription(lastRoundText)
				.setFooter(`Round ${adventure.room.round}`)]
		}).then(message => {
			adventure.delvers.forEach(delver => {
				delver.modifiers = {};
			})
			return adventure;
		}).then(adventure => {
			exports.nextRoom(adventure, channel);
		});
	} else {
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
				let percentBonus = (exports.nextRandomNumber(adventure, 21, "battle") - 10) / 100;
				combatant.roundSpeed = Math.floor(combatant.speed * percentBonus);

				// Roll Critical Hit
				let critRoll = exports.nextRandomNumber(adventure, 4, "battle");
				combatant.crit = critRoll > 2;

				// Decrement Modifiers
				for (let modifierName in combatant.modifiers) {
					if (modifierName !== "Stun") {
						combatant.modifiers[modifierName] -= getTurnDecrement(modifierName);

						if (combatant.modifiers[modifierName] <= 0) {
							delete combatant.modifiers[modifierName];
						}
					} else {
						if (teamName === "ally") {
							// Dummy move for Stunned players
							adventure.room.moves.push(new Move()
								.setSpeed(combatant)
								.setElement(combatant.element)
								.setIsCrit(combatant.crit)
								.setMoveName("Stun")
								.setUser(teamName, i));
						}
					}
				}
			})
		}

		// Roll Enemy Moves
		adventure.room.enemies.forEach((enemy, index) => {
			let actionPool = [];
			Object.values(enemy.actions).forEach(action => {
				for (let i = 0; i < action.weight; i++) {
					actionPool.push(action);
				}
			})
			let action = actionPool[exports.nextRandomNumber(adventure, actionPool.length, "battle")]; //TODO #19 nonrandom AI
			adventure.room.moves.push(new Move()
				.setSpeed(enemy)
				.setElement(enemy.element)
				.setIsCrit(enemy.crit)
				.setMoveName(action.name)
				.setUser(enemy.team, index)
				.addTarget("ally", exports.nextRandomNumber(adventure, adventure.delvers.length, "battle")));
		})

		if (lastRoundText !== "") {
			embed.setDescription(lastRoundText);
		}
		if (!embed.title) {
			embed.setTitle("Combat");
		}
		embed.addField(`0/${adventure.delvers.length} Moves Readied`, "Ready party members will be listed here")
			.setFooter(`Round ${adventure.room.round}`);
		let battleMenu = [new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId("predict")
					.setLabel("Predict")
					.setStyle("SECONDARY"),
				new MessageButton()
					.setCustomId("readymove")
					.setLabel("Ready a Move")
					.setStyle("PRIMARY")
			)];
		channel.send({ embeds: [embed], components: battleMenu }).then(message => {
			adventure.setMessageId("lastComponent", message.id);
			exports.saveAdventures();
		});
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

exports.checkNextRound = function (adventure, channel) {
	if (adventure.room.moves.length >= (adventure.delvers.length + adventure.room.enemies.length)) {
		let embed = new MessageEmbed()
			.setFooter(`Round ${adventure.room.round}`);
		exports.newRound(adventure, channel, embed);
	}
}

//{channelId: guildId} A list of adventure channels that restarting the bot interrupted deleting
let completedAdventures = {};

exports.completeAdventure = function (adventure, channel, result) {
	var baseScore = adventure.depth;
	switch (result) {
		case "success":
			baseScore += adventure.accumulatedScore;
			break;
		case "defeat":
			baseScore += Math.floor(adventure.accumulatedScore / 2);
			break;
	}

	adventure.delvers.forEach(delver => {
		let player = getPlayer(delver.id, channel.guild.id);
		let previousScore = player.scores[channel.guild.id];
		if (previousScore) {
			player.scores[channel.guild.id] += baseScore;
		} else {
			player.scores[channel.guild.id] = baseScore;
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
	channel.send(`The adventure has been completed! Delvers have earned ${baseScore} score (times their personal multiplier). This channel will be cleaned up in 5 minutes.`);
}

exports.saveAdventures = function () {
	ensuredPathSave("./Saves", "adventures.json", JSON.stringify(Array.from(adventureDictionary.values())));
}
