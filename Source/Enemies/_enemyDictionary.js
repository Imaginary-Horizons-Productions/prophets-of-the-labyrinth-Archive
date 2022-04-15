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

exports.injectConfigEnemies = function (isProduction) {
	for (const file of enemyWhitelist) {
		const enemy = require(`./${file}`).injectConfig(isProduction);
		enemyDictionary[enemy.name] = enemy;
	}
	return this;
}

exports.getEnemy = function (enemyName) {
	return enemyDictionary[enemyName];
}
