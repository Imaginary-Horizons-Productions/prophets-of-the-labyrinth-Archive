const crypto = require("crypto");
const { MAX_MESSAGE_ACTION_ROWS } = require("../constants.js");
const Resource = require("./Resource.js");

module.exports = class Adventure {
	/** This read-write payload class describes an ongoing adventure
	 * @param {string} seedInput
	 * @param {string} guildIdInput
	 */
	constructor(seedInput, guildIdInput) {
		this.initialSeed = seedInput || Date.now().toString();
		this.guildId = guildIdInput;
	}
	id; // the id of the thread created for the adventure
	name;
	labyrinth = "Debug Dungeon"; //TODO #462 generate/take labyrinth as input
	state = "config"; // enum: "config", "ongoing", "completed"
	element;
	messageIds = {
		start: "",
		leaderNotice: "",
		deploy: "",
		utility: "",
		room: "",
		battleRound: ""
	};
	leaderId = "";
	delvers = [];
	challenges = {}; // {challengeName: {intensity, reward, duration}} 0 = done, null = permanent
	scouting = {
		finalBoss: false,
		artifactGuardians: 0,
		artifactGuardiansEncountered: 0
	}
	finalBoss = "";
	artifactGuardians = [];
	accumulatedScore = 0;
	depth = 1;
	room = {};
	roomCandidates = {};
	lives = 2;
	gold = 100;
	peakGold = 100;
	artifacts = {}; // {artifactName: {count, staistic1, statistic2...}}
	consumables = {}; // {consumableName: count}
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
				return 150 - (count * 5);
			case "Artifact Guardian":
				return 100 - (count * 5);
		}
	}

	/** Initializes a resource in the room's resources if it's not already present
	 * @param {Resource} resource
	 */
	addResource(resource) {
		if (resource.name in this.room.resources) {
			this.room.resources[resource.name].count += resource.count;
		} else {
			this.room.resources[nameInput] = resource;
		}
	}
}
