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
		return calculateTagContent(this.description, [
			{ tag: 'intensity', count: intensity },
			{ tag: 'duration', count: duration },
			{ tag: 'reward', count: reward }
		]);
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
