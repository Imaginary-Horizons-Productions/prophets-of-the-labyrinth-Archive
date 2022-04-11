const Button = require('../../Classes/Button.js');
const Move = require('../../Classes/Move');
const { SAFE_DELIMITER, generateRandomNumber } = require('../../helpers.js');
const { getAdventure, checkNextRound, endRound, setAdventure } = require('../adventureDAO');
const { getWeaponProperty } = require('../Weapons/_weaponDictionary.js');

module.exports = new Button("nontargetweapon");

module.exports.execute = async function (interaction, [weaponName, round, _weaponIndex]) {
	// Add move object to adventure
	let adventure = getAdventure(interaction.channel.id);
	if (adventure.room.round === Number(round)) {
		let user = adventure.delvers.find(delver => delver.id === interaction.user.id);
		if (user.weapons.some(weapon => weapon.name === weaponName && weapon.uses > 0)) {
			// Add move to round list (overwrite exisiting readied move)
			let userIndex = adventure.delvers.findIndex(delver => delver.id === interaction.user.id);
			user.actionSpeed = getWeaponProperty(weaponName, "speedBonus") || 0;
			let newMove = new Move()
				.setSpeed(user)
				.setIsCrit(user.crit)
				.setMoveName(weaponName)
				.setUser(user.team, userIndex);

			let targetText = "";
			let { target, team } = getWeaponProperty(weaponName, "targetingTags");
			if (target === "all") {
				let targetCount = 0;
				if (team === "delver") {
					targetCount = adventure.delvers.length;
					targetText = "all allies";
				} else if (team === "enemy") {
					targetCount = adventure.room.enemies.length;
					targetText = "all enemies";
				}
				for (let i = 0; i < targetCount; i++) {
					newMove.addTarget(team, i);
				}
			} else if (target.startsWith("random")) {
				let targetCount = Number(target.split(SAFE_DELIMITER)[1]);
				let poolSize = 0;
				if (team === "delver") {
					poolSize = adventure.delvers.length;
					targetText = `${targetCount} random all${targetCount === 1 ? "y" : "ies"}`;
				} else if (team === "enemy") {
					poolSize = adventure.room.enemies.length;
					targetText = `${targetCount} random enem${targetCount === 1 ? "y" : "ies"}`;
				}
				for (let i = 0; i < targetCount; i++) {
					newMove.addTarget(team, generateRandomNumber(adventure, poolSize, "Battle"));
				}
			} else if (target === "self") {
				newMove.addTarget(team, userIndex);
			} else if (target === "none") {
				newMove.addTarget("none", "none");
			}

			let overwritten = false;
			for (let i = 0; i < adventure.room.moves.length; i++) {
				let move = adventure.room.moves[i];
				if (move.userTeam === user.team && move.userIndex === userIndex) {
					await adventure.room.moves.splice(i, 1, newMove);
					overwritten = true;
					break;
				}
			}
			if (!overwritten) {
				await adventure.room.moves.push(newMove);
			}

			// Send confirmation text
			interaction.update({ components: [] });
			interaction.channel.send(`${interaction.user} ${overwritten ? "switches to ready" : "readies"} **${weaponName}**${target !== "none" && target !== "self" ? ` to use on **${targetText}**` : ""}.`).then(() => {
				setAdventure(adventure);
				if (checkNextRound(adventure)) {
					endRound(adventure, interaction.channel);
				};
			}).catch(console.error);
		} else {
			interaction.reply({ content: `You don't have a ${weaponName} with uses remaining.`, ephemeral: true })
				.catch(console.error);
		}
	} else {
		interaction.update({ components: [] });
	}
}
