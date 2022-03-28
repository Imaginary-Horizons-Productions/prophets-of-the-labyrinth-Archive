exports.injectConfigChallenges = function (isProduction) {
	return this;
}

let challengeWhitelist = [
	"cantholdallthisvalue.js",
	"restless.js"
];

const CHALLENGES = {};

for (const file of challengeWhitelist) {
	const challenge = require(`./${file}`);
	CHALLENGES[challenge.name] = challenge;
}

exports.getChallenge = function (challengeName) {
	return CHALLENGES[challengeName];
}

exports.rollChallenge = function (adventure) {
	//TODO #285 implement
}
