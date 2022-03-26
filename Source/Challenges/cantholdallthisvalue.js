const ChallengeTemplate = require("../../Classes/ChallengeTemplate.js");

module.exports = new ChallengeTemplate("Can't Hold All this Value", "Reduce the number of weapons a delver can carry by @{intensity}.")
	.setIntensity(1)
	.setDuration(null)
	.setScoreMultiplier(1.2);

module.exports.reward = function (adventure) { }
