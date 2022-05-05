var buttonWhitelist = [
	"buylife.js",
	"buyscouting.js",
	"collectartifact.js",
	"continue.js",
	"deploy.js",
	"elementswap.js",
	"getgoldonfire.js",
	"hpshare.js",
	"inspectself.js",
	"join.js",
	"modifier.js",
	"nontargetmove.js",
	"predict.js",
	"ready.js",
	"readymove.js",
	"replaceequipment.js",
	"rest.js",
	"routevote.js",
	"takegold.js",
	"upgrade.js",
	"viewchallenges.js",
	"viewrepairs.js",
	"viewstartingartifacts.js"
];

const buttonDictionary = {};

for (const file of buttonWhitelist) {
	const button = require(`./${file}`);
	buttonDictionary[button.name] = button;
}

exports.getButton = (buttonName) => {
	return buttonDictionary[buttonName];
}
