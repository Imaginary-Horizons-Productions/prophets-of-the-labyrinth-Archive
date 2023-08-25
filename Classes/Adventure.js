const crypto = require("crypto");
const { MAX_MESSAGE_ACTION_ROWS } = require("../constants.js");
const Combatant = require("./Combatant.js");
const Resource = require("./Resource.js");
const { Room } = require("./Room.js");
const Delver = require("./Delver.js");

module.exports.Adventure = class {
	/** This read-write payload class describes an ongoing adventure
	 * @param {string} seedInput
	 * @param {string} guildIdInput
	 */
	constructor(seedInput, guildIdInput) {
		this.initialSeed = seedInput || Date.now().toString();
		this.guildId = guildIdInput;
	}
	/** @type {string} the id of the thread created for the adventure */
	id;
	name;
	labyrinth = "Debug Dungeon"; //TODO #462 generate/take labyrinth as input
	/** @type {"config" | "ongoing" | "success" | "defeat" | "giveup"} */
	state = "config";
	static endStates = ["success", "defeat", "giveup"];
	element;
	messageIds = {
		recruit: "",
		utility: "",
		room: "",
		battleRound: ""
	};
	leaderId = "";
	/** @type {Delver[]} */
	delvers = [];
	challenges = {}; // {challengeName: {intensity, reward, duration}} 0 = done, null = permanent
	scouting = {
		finalBoss: false,
		artifactGuardians: 0,
		artifactGuardiansEncountered: 0
	}
	finalBoss = "";
	/** @type {string[]} */
	artifactGuardians = [];
	accumulatedScore = 0;
	depth = 1;
	/** @type {Room} */
	room = {};
	roomCandidates = {};
	lives = 2;
	gold = 100;
	peakGold = 100;
	/** @type {Record<string, {count: number; [statistic: string]: number}>} */
	artifacts = {};
	/** @type {Record<string, number>} {consumableName: count} */
	consumables = {};
	rnIndices = {
		general: 0,
		battle: 0
	};
	rnTable = "";

	generateRNTable() {
		let hash = crypto.createHash("sha256").update(this.initialSeed).digest("hex");
		let segments = [];
		for (let i = 0; i < hash.length; i += 4) {
			segments.push(hash.slice(i, i + 4));
		}
		this.rnTable = segments.reduce((table, segment) => table + parseInt(segment, 16).toString(12), "");
		return this;
	}

	setId(textChannelId) {
		this.id = textChannelId;
		return this;
	}

	setName(nameInput) {
		this.name = nameInput;
		return this;
	}

	setElement(elementEnum) {
		this.element = elementEnum;
		return this;
	}

	setLeaderId(id) {
		this.leaderId = id;
		return this;
	}

	/** Get an array with Untyped and all elements in the party
	 * @returns {string[]}
	 */
	getElementPool() {
		return this.delvers.reduce((elements, delver) => {
			if (!elements.includes(delver.element)) {
				return [...elements, delver.element];
			} else {
				return elements;
			}
		}, ["Untyped"]);
	}

	getArtifactCount(artifactName) {
		return this.artifacts[artifactName]?.count || 0;
	}

	getChallengeIntensity(challengeName) {
		return this.challenges[challengeName]?.intensity || 0;
	}

	getChallengeDuration(challengeName) {
		return this.challenges[challengeName]?.duration || 0;
	}

	getEquipmentCapacity() {
		let count = 4 + this.getArtifactCount("Hammerspace Holster") - this.getChallengeIntensity("Can't Hold All this Value");
		count = Math.min(MAX_MESSAGE_ACTION_ROWS, count);
		count = Math.max(1, count);
		return count;
	}

	gainGold(integer) {
		this.gold += integer;
		if (this.gold > this.peakGold) {
			this.peakGold = this.gold;
		}
		return this.gold;
	}

	gainArtifact(artifact, count) {
		if (artifact === "Oil Painting") {
			this.gainGold(500 * count);
			this.updateArtifactStat(artifact, "Gold Gained", 500 * count);
		} else if (artifact === "Phoenix Fruit Blossom") {
			this.lives += count;
			this.updateArtifactStat(artifact, "Lives Gained", count);
		} else if (artifact === "Hammerspace Holster") {
			this.updateArtifactStat(artifact, "Extra Equipment Capacity", count);
		}
		if (artifact in this.artifacts) {
			this.artifacts[artifact].count += count;
		} else {
			this.artifacts[artifact] = { count: count };
		}
	}

	/**
	 * @param {string} artifactName
	 * @param {string} statName the stat to add to (in case of multiple stats per artifact)
	 * @param {number} stat the amount to be added
	 */
	updateArtifactStat(artifactName, statName, stat) {
		if (this.artifacts[artifactName]) {
			if (statName in this.artifacts[artifactName]) {
				this.artifacts[artifactName][statName] += stat;
			} else {
				this.artifacts[artifactName][statName] = stat;
			}
		}
	}

	/** Applies relics, challenges, etc to scouting cost
	 * @param {"Final Battle" | "Artifact Guardian"} type
	 * @returns {number}
	 */
	calculateScoutingCost(type) {
		const count = this.getArtifactCount("Amethyst Spyglass");
		switch (type) {
			case "Final Battle":
				return Math.max(150 - (count * 15), 0);
			case "Artifact Guardian":
				return Math.max(100 - (count * 15), 0);
		}
	}

	/** Initializes a resource in the room's resources if it's not already present
	 * @param {Resource} resource
	 */
	addResource(resource) {
		if (resource.name in this.room.resources) {
			this.room.resources[resource.name].count += resource.count;
		} else {
			this.room.resources[resource.name] = resource;
		}
	}

	/** Get a delver or enemy based on the team and index of the combatant
	 * @param {CombatantReference} reference
	 * @returns {Combatant | undefined}
	 */
	getCombatant({ team, index }) {
		switch (team) {
			case "delver":
				return this.delvers[index];
			case "clone":
			case "enemy":
				return this.room.enemies[index];
			case "none":
				return undefined;
		}
	}
};

module.exports.CombatantReference = class {
	/**
	 * @param {"delver" | "enemy" | "none"} teamInput
	 * @param {number} indexInput
	*/
	constructor(teamInput, indexInput) {
		this.team = teamInput;
		this.index = indexInput;
	}
};
