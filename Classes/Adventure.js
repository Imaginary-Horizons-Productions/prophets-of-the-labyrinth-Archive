module.exports = class Adventure {
	constructor(seedInput) {
		this.initialSeed = seedInput || Date.now().toString();
		this.rnTable = linearRandomGenerator(processSeed(this.initialSeed, seedInput !== undefined)).join("");
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

function processSeed(initialSeed, seedProvidedByUser) {
	let lumber; // will become a table later
	if (seedProvidedByUser) {
		// Sum the unicode indices of the characters
		lumber = Array.from(initialSeed).reduce((total, current) => total += current.charCodeAt(0), 0).toString();
	} else {
		lumber = initialSeed;
	}
	return lumber.substring(-5); // planks
}

function linearRandomGenerator(seed) {
	const results = [];
	let totalLength = 0;
	while (totalLength < 10000) {
		seed = (5 * seed + 7) % 100003;
		let binary = seed.toString(2);
		results.push(binary);
		totalLength += binary.length;
	}
	return results;
}
