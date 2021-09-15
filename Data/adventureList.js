const { setPlayer, getPlayer } = require("./playerList.js");
const fs = require("fs");
const { roomDictionary } = require("./Rooms/_roomDictionary.js");
const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require("discord.js");

var filePath = "./Saves/adventures.json";
var requirePath = "./../Saves/adventures.json";
var adventureDictionary = new Map();

exports.loadAdventures = function () {
	return new Promise((resolve, reject) => {
		if (fs.existsSync(filePath)) {
			var adventures = require(requirePath);
			adventures.forEach(adventure => {
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
	if (adventure.depth > 3) {
		adventure.accumulatedScore = 10;
		return exports.completeAdventure(adventure, channel, "success");
	} else {
		let roomPool = Object.values(roomDictionary);
		let indexEnd = adventure.rnIndex + roomPool.length.toString().length;
		let index;
		if (indexEnd < adventure.rnIndex) {
			index = adventure.rnTable.slice(adventure.rnIndex) + adventure.rnTable.slice(0, indexEnd);
		} else {
			index = adventure.rnTable.slice(adventure.rnIndex, indexEnd);
		}
		let room = roomPool[index];
		adventure.rnIndex = (adventure.rnIndex + 1) % adventure.rnTable.length;
		if (adventure.type === "battle") {
			exports.startBattle(adventure, room, channel);
		}
		let embed = new MessageEmbed()
			.setAuthor(`Entering Room #${adventure.depth}`, channel.client.user.displayAvatarURL())
			.setTitle(room.title)
			.setDescription(room.description);
		return { embeds: [embed], components: room.components };
	}
}

exports.startBattle = function (adventure, room, channel) {
	adventure.battleRound = 0;
	adventure.battleEnemies.concat(room.enemies);
	exports.newRound(adventure, channel);
}

exports.newRound = function (adventure, channel) {
	let embed = new MessageEmbed();
	channel.send({ embeds: [embed], components: generateBattleMenu(adventure) });  //TODO how to clear previous round components?
}

exports.generateBattleMenu = function (adventure) {
	let moveOptions = [];
	for (i = 0; i < adventure.enemies.length; i++) {
		moveOptions.push({
			label: adventure.enemies[i].name,
			description: "",
			value: `enemy-${i}`
		})
	}
	for (i = 0; i < adventure.delvers.length; i++) {
		moveOptions.push({
			label: adventure.delvers[i].name,
			description: "",
			value: `enemy-${i}`
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
					.setCustomId(`move`)
					.setPlaceholder("Use your first move on...")
					.addOptions(moveOptions)
			),
		new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
					.setCustomId(`move`)
					.setPlaceholder("Use your second move on...")
					.addOptions(moveOptions)
			),
		new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
					.setCustomId(`move`)
					.setPlaceholder("Use your third move on...")
					.addOptions(moveOptions)
			),
		new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
					.setCustomId(`move`)
					.setPlaceholder("Use your fourth move on...")
					.addOptions(moveOptions)
			)
	]; // read, inspect self, moves

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
