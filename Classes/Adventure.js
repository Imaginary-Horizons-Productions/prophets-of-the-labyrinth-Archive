module.exports = class Adventure {
	constructor(seedInput) {
		this.id; // the id of the channel created for the adventure
		this.name;
		this.initialSeed = seedInput || Date.now().toString();
		this.rnTable = linearRandomGenerator(processSeed(this.initialSeed, seedInput !== undefined)).join("");
		this.rnIndex = 0;
		this.rnIndexBattle = 0;
        this.startMessageId;
		this.lastComponentMessageId = "";
		this.delvers = [];
		this.accumulatedScore = 0;
		this.depth = 0;
		this.lives = 1;
		this.gold = 100;
		this.battleRound;
		this.battleEnemies = [];
		this.battleMoves = [];
	}

	setName (nameInput) {
		this.name = nameInput;
		return this;
	}

	setId (textChannelId) {
		this.id = textChannelId;
		return this;
	}

	setStartMessageID(id) {
		this.startMessageId = id;
		return this;
	}

	setLeader(delver) {
		this.delvers.push(delver);
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
	for (let i = 0; i < 10000; i++) {
		seed = (5 * seed + 7) % 100003;
		results.push(seed);
	}
	return results;
}
