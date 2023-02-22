const { calculateTagContent } = require("../helpers");

module.exports = class ChallengeTemplate {
	constructor(nameInput, descriptionInput) {
		this.name = nameInput;
		this.description = descriptionInput;
	}
	intensity = 1;
	duration = null;
	scoreMultiplier = 1;
	reward = 0;

	complete(adventure, thread) { }

	dynamicDescription(intensity, duration, reward) {
		let description = calculateTagContent(this.description, 'intensity', intensity);
		description = calculateTagContent(description, 'duration', duration);
		return calculateTagContent(description, 'reward', reward);
	}

	setIntensity(intensityInput) {
		this.intensity = intensityInput;
		return this;
	}

	setDuration(durationInputs) {
		this.duration = durationInputs;
		return this;
	}

	setScoreMultiplier(multiplierInput) {
		this.scoreMultiplier = multiplierInput;
		return this;
	}

	setReward(rewardInput) {
		this.reward = rewardInput;
		return this;
	}
}
