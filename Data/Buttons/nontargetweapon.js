const Button = require('../../Classes/Button.js');
const Move = require('../../Classes/Move');
const { getAdventure, saveAdventures, checkNextRound, updateRoundMessage, nextRandomNumber, endRound } = require('../adventureDAO');

module.exports = new Button("nontargetweapon");

module.exports.execute = (interaction, args) => {
	// Add move object to adventure
	let adventure = getAdventure(interaction.channel.id);
	let user = adventure.delvers.find(delver => delver.id === interaction.user.id);
	let weaponIndex = args[0];
	let weapon;
	let confirmationText = "";
	if (parseInt(weaponIndex) < user.weapons.length) {
		weapon = user.weapons[weaponIndex];

		// Add move to round list (overwrite exisiting readied move)
		let userIndex = adventure.delvers.findIndex(delver => delver.id === interaction.user.id);
		let overwritten = false;
		let newMove = new Move()
			.setSpeed(user)
			.setElement(weapon.element)
			.setIsCrit(user.crit)
			.setMoveName(weapon.name)
			.setUser(user.team, userIndex);

		let targetText = "";
		let targetTeam = weapon.targetingTags.team;
		if (weapon.targetingTags.target === "all") {
			let targetCount = 0;
			if (targetTeam === "ally") {
				targetCount = adventure.delvers.length;
				targetText = "all allies";
			} else if (targetTeam === "enemy") {
				targetCount = adventure.room.enemies.length;
				targetText = "all enemies";
			}
			for (let i = 0; i < targetCount; i++) {
				newMove.addTarget(targetTeam, i);
			}
		} else if (weapon.targetingTags.target === "random") {
			if (targetTeam === "ally") {
				newMove.addTarget(targetTeam, nextRandomNumber(adventure, adventure.delvers.length, "battle"));
				targetText = "a random ally";
			} else if (targetTeam === "enemy") {
				newMove.addTarget(targetTeam, nextRandomNumber(adventure, adventure.room.enemies.length, "battle"));
				targetText = "a random enemy";
			}
		} else if (weapon.targetingTags.target === "self") {
			newMove.addTarget(targetTeam, userIndex);
			targetText = "themself";
		}

		for (let i = 0; i < adventure.room.moves.length; i++) {
			let move = adventure.room.moves[i];
			if (move.userTeam === user.team && move.userIndex === userIndex) {
				adventure.room.moves.splice(i, 1, newMove);
				overwritten = true;
				break;
			}
		}
		if (!overwritten) {
			adventure.room.moves.push(newMove);
		}

		// Send confirmation text
		confirmationText = `${interaction.user} readies **${weapon.name}** to use on **${targetText}**.` + confirmationText;
		interaction.reply({ content: confirmationText })
			.catch(console.error);
		saveAdventures();
		updateRoundMessage(interaction.channel.messages, adventure);
		if (checkNextRound(adventure)) {
			endRound(adventure, interaction.channel);
		};
	} else {
		interaction.reply({ content: `You don't have that weapon anymore.`, ephemeral: true })
			.catch(console.error);
	}
}
