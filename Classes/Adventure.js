const crypto = require("crypto");

module.exports = class Adventure {
	constructor(seedInput) {
		this.initialSeed = seedInput || Date.now().toString();
	}
	id; // the id of the thread created for the adventure
	name;
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
	difficultyOptions = [];
	scouting = {
		finalBoss: false,
		artifactGuardians: 0,
		artifactGuardiansEncountered: 0
	}
	finalBoss = "";
	artifactGuardians = [];
	accumulatedScore = 0;
	depth = 0;
	room = {};
	roomCandidates = {};
	lives = 2;
	gold = 100;
	peakGold = 100;
	artifacts = {};
	rnIndex = 0;
	rnIndexBattle = 0;
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

	gainGold(integer) {
		this.gold += integer;
		if (this.gold > this.peakGold) {
			this.peakGold = this.gold;
		}
		return this.gold;
	}

	gainArtifact(artifact, count) {
		if (artifact === "Oil Painting") {
			this.gold += 500 * count;
		}
		if (this.artifacts[artifact]) {
			this.artifacts[artifact] += count;
		} else {
			this.artifacts[artifact] = count;
		}
	}
}
