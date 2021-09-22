const { setPlayer, getPlayer } = require("./playerList.js");
const fs = require("fs");
const { roomDictionary } = require("./Rooms/_roomDictionary.js");
const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require("discord.js");
const { weaponDictionary } = require("./Weapons/_weaponDictionary.js");
const { enemyDictionary } = require("./Enemies/_enemyDictionary.js");
const Move = require("./../Classes/Move.js");

var filePath = "./Saves/adventures.json";
var requirePath = "./../Saves/adventures.json";
var adventureDictionary = new Map();

exports.loadAdventures = function () {
	return new Promise((resolve, reject) => {
		if (fs.existsSync(filePath)) {
			var adventures = require(requirePath);
			adventures.forEach(adventure => {
				//TODO cast as Adventure class
				//TODO cast adventure.delvers as Delver class
				adventureDictionary.set(adventure.id, adventure);
			})
			resolve();
		} else {
			if (!fs.existsSync("./Saves")) {
				fs.mkdirSync("./Saves", { recursive: true });
			}
			fs.writeFile(filePath, "[]", "utf8", error => {
				if (error) {
					console.error(error);
				}
			})
			resolve();
		}
	})
}

exports.getAdventure = function (id) {
	return adventureDictionary.get(id);
}

exports.setAdventure = function (adventure) {
	adventureDictionary.set(adventure.id, adventure);
	exports.saveAdventures()
}

exports.nextRoom = function (adventure, channel) {
	adventure.depth++;
	if (adventure.lastComponentMessageId) {
		channel.messages.fetch(adventure.lastComponentMessageId).then(message => {
			message.edit({ components: [] });
		}).catch(console.error);
	}
	if (adventure.depth > 3) {
		adventure.accumulatedScore = 10;
		return exports.completeAdventure(adventure, channel, "success");
	} else {
		let roomPool = Object.values(roomDictionary);
		let room = roomPool[0];//let room = roomPool[adventure.nextRandomNumber(roomPool.length)];
		let embed = new MessageEmbed()
			.setAuthor(`Entering Room #${adventure.depth}`, channel.client.user.displayAvatarURL())
			.setTitle(room.title)
			.setDescription(room.description);
		if (room.type === "battle") {
			return exports.startBattle(adventure, room, channel, embed);
		} else {
			return { embeds: [embed], components: room.components, fetchReply: true };
		}
	}
}

exports.startBattle = function (adventure, room, channel, embed) {
	adventure.battleRound = 0;
	console.log(room.enemies);
	Object.keys(room.enemies).forEach(enemyName => {
		for (let i = 0; i < room.enemies[enemyName]; i++) {
			let enemy = {};
			Object.assign(enemy, enemyDictionary[enemyName])
			adventure.battleEnemies.push(enemy);
		}
	})
	adventure.delvers.forEach(delver => { //TODO generate delvers based on character picks
		delver.weapons.push(weaponDictionary["dagger"]);
	})
	return exports.newRound(adventure, channel, embed);
}

exports.checkNextRound = function (adventure, channel) {
	if (adventure.battleMoves.length >= (adventure.delvers.length + adventure.battleEnemies.length)) {
		let embed = new MessageEmbed()
			.setFooter(`Round ${adventure.battleRound}`);
		channel.send(exports.newRound(adventure, channel, embed)).then(message => {
			adventure.lastComponentMessageId = message.id;
		});
	}
}

exports.newRound = function (adventure, channel, embed) {
	// Resolve round's moves
	let lastRoundText = "";
	adventure.battleMoves.forEach(move => {
		let userTeam = move.userTeam === "ally" ? adventure.delvers : adventure.battleEnemies;
		let user = userTeam[move.userIndex];
		if (user.hp > 0) {
			let target;
			if (move.targetTeam === "ally") {
				target = adventure.delvers[move.targetIndex];
				target.takeDamage(channel, move.damage);
			} else {
				target = adventure.battleEnemies[move.targetIndex];
				target.hp -= move.damage;
				if (target.hp <= 0) {
					target.hp = 0;
				}
			}

			lastRoundText += `${user.name} dealt ${move.damage} damage to ${target.name}.\n`;
			//TODO decrement weapon durability and check for breakage
		}
	})
	adventure.battleMoves = [];

	// Check for Victory or Defeat
	if (adventure.delvers.every(delver => delver.hp <= 0)) {
		channel.send(exports.completeAdventure(adventure, channel, "defeat"));
	}
	if (adventure.battleEnemies.every(enemy => enemy.hp === 0)) {
		channel.send("Victory!").then(message => {
			adventure.battleRound = 0;
			adventure.battleMoves = [];
			adventure.battleEnemies = [];
			channel.send(exports.nextRoom(adventure, channel));
		});
	}

	// Increment round and clear last round's components
	if (adventure.lastComponentMessageId) {
		channel.messages.fetch(adventure.lastComponentMessageId).then(message => {
			message.edit({ components: [] });
		})
	}
	adventure.battleRound++;

	// Next Round's Prerolls
	//TODO crits
	for (let i = 0; i < adventure.battleEnemies.length; i++) {
		let enemy = adventure.battleEnemies[i];
		let action = enemy.actions[0]; //TODO move selection AI
		adventure.battleMoves.push(new Move()
			.setSpeed(enemy.speed)
			.setUser("enemy", i)
			.setTarget("player", 0) //TODO targeting AI
			.setDamage(action.damage)); //TODO enemy action effects
	}
	if (lastRoundText !== "") {
		embed.setDescription(lastRoundText);
	}
	embed.setFooter(`Round ${adventure.battleRound}`);
	return { embeds: [embed], components: exports.generateBattleMenu(adventure), fetchReply: true };
}

exports.generateBattleMenu = function (adventure) {
	let targetOptions = [];
	for (i = 0; i < adventure.battleEnemies.length; i++) {
		targetOptions.push({
			label: adventure.battleEnemies[i].name,
			description: "",
			value: `enemy-${i}`
		})
	}
	for (i = 0; i < adventure.delvers.length; i++) {
		targetOptions.push({
			label: adventure.delvers[i].name,
			description: "",
			value: `ally-${i}`
		})
	}
	let battleMenu = [
		new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId("read")
					.setLabel("Read")
					.setStyle("PRIMARY"),
				new MessageButton()
					.setCustomId("self")
					.setLabel("Inspect self")
					.setStyle("SECONDARY")
			),
		new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
					.setCustomId(`weapon-0`)
					.setPlaceholder("Use your first weapon on...")
					.addOptions(targetOptions)
			),
		new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
					.setCustomId(`weapon-1`)
					.setPlaceholder("Use your second weapon on...")
					.addOptions(targetOptions)
			),
		new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
					.setCustomId(`weapon-2`)
					.setPlaceholder("Use your third weapon on...")
					.addOptions(targetOptions)
			),
		new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
					.setCustomId(`weapon-3`)
					.setPlaceholder("Use your fourth weapon on...")
					.addOptions(targetOptions)
			)
	];

	return battleMenu;
}

exports.completeAdventure = function (adventure, channel, result) {
	var baseScore;
	switch (result) {
		case "success":
			baseScore = adventure.accumulatedScore;
			break;
		case "defeat":
			baseScore = Math.floor(adventure.accumulatedScore / 2);
			break;
	}

	adventure.delvers.forEach(delver => {
		let player = getPlayer(delver.id, channel.guild.id);
		if (player.score[channel.guild.id]) {
			player.score[channel.guild.id] += baseScore;
		} else {
			player.score[channel.guild.id] = baseScore;
		}
		setPlayer(player);
	})
	adventureDictionary.delete(channel.id);
	setTimeout(() => { //TODO set to clear on startup if interrupted
		channel.delete("Adventure complete!");
	}, 300000);
	return { content: `The adventure has been completed! Delvers have earned ${baseScore} score (times their personal multiplier). This channel will be cleaned up in 5 minutes.` };
}

exports.saveAdventures = function () {
	if (!fs.existsSync("./Saves")) {
		fs.mkdirSync("./Saves", { recursive: true });
	}
	fs.writeFile(filePath, JSON.stringify(Array.from((adventureDictionary.values()))), "utf8", error => {
		if (error) {
			console.error(error);
		}
	})
}
