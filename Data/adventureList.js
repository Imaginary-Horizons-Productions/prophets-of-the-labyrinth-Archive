const { setPlayer, getPlayer } = require("./playerList.js");
const fs = require("fs");
const { roomDictionary } = require("./Rooms/_roomDictionary.js");
const { MessageEmbed } = require("discord.js");

var filePath = "./../Saves/adventures.json";
var adventureDictionary = new Map();

exports.loadAdventures = function () {
	return new Promise((resolve, reject) => {
		if (fs.existsSync(filePath)) {
			var adventures = require(filePath);
			adventures.forEach(adventure => {
				adventureDictionary.set(adventure.id, adventure);
			})
			resolve();
		} else {
			if (!fs.existsSync("./../Saves")) {
				fs.mkdirSync("./../Saves", { recursive: true });
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
		let room = roomDictionary["Gold on Fire"];
		let embed = new MessageEmbed()
			.setAuthor(`Entering Room #${adventure.depth}`, channel.client.user.displayAvatarURL())
			.setTitle(room.title)
			.setDescription(room.description);
		return { embeds: [embed], components: room.components };
	}
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
	if (!fs.existsSync("./../Saves")) {
		fs.mkdirSync("./../Saves", { recursive: true });
	}
	fs.writeFile(filePath, JSON.stringify(Array.from((adventureDictionary.values()))), "utf8", error => {
		if (error) {
			console.error(error);
		}
	})
}
