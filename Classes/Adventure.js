const { sha256 } = require("js-sha256");

module.exports = class Adventure {
	constructor(seedInput) {
		this.initialSeed = seedInput || Date.now().toString();
	}
	id; // the id of the channel created for the adventure
	name;
	element;
	scouting = {
		finalBoss: false,
		midBosses: 0,
		midBossesEncountered: 0
	}
	finalBoss = "Hall of Mirrors";
	midBosses = [];
	rnIndex = 0;
	rnIndexBattle = 0;
	messageIds = {
		recruit: "",
		deploy: "",
		start: "",
		utility: "",
		lastComponent: ""
	};
	leaderId = "";
	delvers = [];
	difficultyOptions = [];
	accumulatedScore = 0;
	depth = 0;
	room = {};
	lives = 2;
	gold = 100;
	rnTable = "";

	generateRNTable() {
		let hash = sha256(this.initialSeed);
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
}
