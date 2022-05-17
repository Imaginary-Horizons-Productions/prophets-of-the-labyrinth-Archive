const enemyWhitelist = [
	"bloodtailhawk.js",
	"clone.js",
	"elkemist.js",
	"firearrowfrog.js",
	"geodetortoise.js",
	"mechabee.js",
	"ooze.js",
	"royalslime.js",
	"slime.js",
	"treasureelemental.js"
];

const enemyDictionary = {};

for (const file of enemyWhitelist) {
	const enemy = require(`./${file}`);
	enemyDictionary[enemy.name] = enemy;
}

exports.getEnemy = function (enemyName) {
	return enemyDictionary[enemyName];
}
