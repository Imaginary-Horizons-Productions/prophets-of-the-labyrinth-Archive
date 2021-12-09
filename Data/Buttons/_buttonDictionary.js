var buttonWhitelist = [
	"buylife.js",
	"challenge.js",
	"continue.js",
	"deploy.js",
	"getgoldonfire.js",
	"giveup.js",
	"hpshare.js",
	"join.js",
	"nontargetweapon.js",
	"partystats.js",
	"predict.js",
	"ready.js",
	"readymove.js",
	"repair.js",
	"replaceweapon.js",
	"rest.js",
	"routevote.js",
	"self.js",
	"takegold.js",
	"takeweapon.js",
	"upgrade.js"
];

const buttonDictionary = {};

for (const file of buttonWhitelist) {
	const button = require(`./${file}`);
	buttonDictionary[button.name] = button;
}

exports.getButton = (buttonName) => {
	return buttonDictionary[buttonName];
}
