const ChallengeTemplate = require("../../Classes/ChallengeTemplate.js");

module.exports = new ChallengeTemplate("Rushing", "When choosing future rooms there's a @{intensity}% chance room type will be unknown.")
	.setIntensity(25)
	.setDuration(null)
	.setScoreMultiplier(1.5)
	.setReward(0);

module.exports.complete = function (adventure, thread) { }
