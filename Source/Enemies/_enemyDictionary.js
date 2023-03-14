const enemyDictionary = {};

for (const file of [
	"bloodtailhawk.js",
	"clone.js",
	"elkemist.js",
	"firearrowfrog.js",
	"geodetortoise.js",
	"mechabee.js",
	"mechaqueen.js",
	"ooze.js",
	"royalslime.js",
	"slime.js",
	"treasureelemental.js"
]) {
	const enemy = require(`./${file}`);
	enemyDictionary[enemy.name] = enemy;
}

exports.getEnemy = function (enemyName) {
	return enemyDictionary[enemyName];
}
