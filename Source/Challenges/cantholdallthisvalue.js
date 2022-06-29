const ChallengeTemplate = require("../../Classes/ChallengeTemplate.js");

module.exports = new ChallengeTemplate("Can't Hold All this Value", "Reduce the pieces of equipment a delver can carry by @{intensity}.")
	.setIntensity(1)
	.setDuration(null)
	.setScoreMultiplier(1.2)
	.setReward(0);

module.exports.complete = function (adventure, thread) { }
