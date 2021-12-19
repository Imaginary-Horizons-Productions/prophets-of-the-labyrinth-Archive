const crypto = require("crypto");

module.exports = class Adventure {
	constructor(seedInput) {
		this.initialSeed = seedInput || Date.now().toString();
	}
	id; // the id of the thread created for the adventure
	name;
	element;
	scouting = {
		finalBoss: false,
		relicGuardians: 0,
		relicGuardiansEncountered: 0
	}
	finalBoss = "Hall of Mirrors";
	relicGuardians = [];
	rnIndex = 0;
	rnIndexBattle = 0;
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
	accumulatedScore = 0;
	depth = 0;
	room = {};
	roomCandidates = {};
	lives = 2;
	gold = 100;
	peakGold = 100;
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

	setMessageId(type, id) {
		this.messageIds[type] = id;
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
}
