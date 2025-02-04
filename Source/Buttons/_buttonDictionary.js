const buttonDictionary = {};

for (const file of [
	"buylife.js",
	"buyscouting.js",
	"deploy.js",
	"elementswap.js",
	"freerepairkit.js",
	"getgoldonfire.js",
	"hpshare.js",
	"inspectself.js",
	"join.js",
	"modifier.js",
	"confirmmove.js",
	"predict.js",
	"ready.js",
	"readyconsumable.js",
	"readymove.js",
	"replaceequipment.js",
	"rest.js",
	"routevote.js",
	"upgrade.js",
	"viewchallenges.js",
	"viewcollectartifact.js",
	"viewrepairs.js",
	"viewstartingartifacts.js"
]) {
	const button = require(`./${file}`);
	buttonDictionary[button.name] = button;
}

exports.callButton = function (mainId, interaction, args) {
	buttonDictionary[mainId].execute(interaction, args);
}
