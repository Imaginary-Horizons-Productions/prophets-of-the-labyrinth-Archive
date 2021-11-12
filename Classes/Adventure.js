const { sha256 } = require("js-sha256");

module.exports = class Adventure {
	constructor(seedInput) {
		this.initialSeed = seedInput || Date.now().toString();
		this.rnTable = parseInt(sha256(this.initialSeed), 16).toString(12);
	}
	id; // the id of the channel created for the adventure
	name;
	element;
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
	room;
	lives = 2;
	gold = 100;

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
