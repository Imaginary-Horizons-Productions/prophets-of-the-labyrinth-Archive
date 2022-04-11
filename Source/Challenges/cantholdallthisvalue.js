const ChallengeTemplate = require("../../Classes/ChallengeTemplate.js");

module.exports = new ChallengeTemplate("Can't Hold All this Value", "Reduce the number of weapons a delver can carry by @{intensity}.")
	.setIntensity(1)
	.setDuration(null)
	.setScoreMultiplier(1.2)
	.setReward(0);

module.exports.complete = function (adventure, thread) { }
