const { MessageActionRow, MessageButton, MessageSelectMenu, ThreadChannel, MessageEmbed } = require("discord.js");
const Adventure = require("../Classes/Adventure.js");

const { SAFE_DELIMITER, MAX_MESSAGE_ACTION_ROWS } = require("../constants.js");
const { ordinalSuffixEN } = require("../helpers");

const { getArtifact } = require("./Artifacts/_artifactDictionary");
const { getChallenge } = require("./Challenges/_challengeDictionary.js");
const { getColor } = require("./elementHelpers.js");
const { buildEquipmentDescription, getEquipmentProperty } = require("./equipment/_equipmentDictionary");
const { getLabyrinthProperty } = require("./labyrinths/_labyrinthDictionary.js");
const { getRoom } = require("./Rooms/_roomDictionary.js");

/** Derive the embeds and components that correspond with the adventure's state
 * @param {Adventure} adventure
 * @param {ThreadChannel} thread
 * @param {string} descriptionOverride
 */
exports.renderRoom = function (adventure, thread, descriptionOverride) {
	const roomTemplate = getRoom(adventure.room.title);
	const { hasEnemies } = adventure.room;
	const isCombatVictory = adventure.room.enemies?.every(enemy => enemy.hp === 0);

	const roomEmbed = new MessageEmbed().setColor(getColor(adventure.room.element))
		.setAuthor({ name: roomHeaderString(adventure), iconURL: thread.client.user.displayAvatarURL() })
		.setTitle(`${adventure.room.title}${isCombatVictory ? " - Victory!" : ""}`)
		.setFooter({ text: `Room #${adventure.depth}${hasEnemies ? ` - Round ${adventure.room.round}` : ""}` });

	if (descriptionOverride || roomTemplate) {
		roomEmbed.setDescription(descriptionOverride || roomTemplate.description.replace("@{roomElement}", adventure.room.element));
	}
	let components = [];

	if (adventure.depth <= getLabyrinthProperty(adventure.labyrinth, "maxDepth")) {
		if (adventure.state !== "completed") {
			// Continue
			if ("roomAction" in adventure.room.resources) {
				roomEmbed.addField("Room Actions", adventure.room.resources.roomAction.count.toString());
			}

			if (!hasEnemies || isCombatVictory) {
				roomEmbed.addField("Decide the next room", "Each delver can pick or change their pick for the next room. The party will move on when the decision is unanimous.")
			} else {
				components.push(new MessageActionRow().addComponents(
					new MessageButton().setCustomId("inspectself")
						.setLabel("Inspect Self")
						.setStyle("SECONDARY"),
					new MessageButton().setCustomId("predict")
						.setEmoji("🔮")
						.setLabel("Predict")
						.setStyle("SECONDARY"),
					new MessageButton().setCustomId("readymove")
						.setLabel("Ready a Move")
						.setStyle("PRIMARY"),
					new MessageButton().setCustomId("readyconsumable")
						.setLabel("Ready a Consumable")
						.setStyle("PRIMARY")
						.setDisabled(!Object.values(adventure.consumables).some(quantity => quantity > 0))
				));
			}
			if (roomTemplate) {
				components.push(...roomTemplate.uiRows);
			}
			if (adventure.room.title === "Treasure!") {
				components.push(exports.generateTreasureRow(adventure));
			}
			components.push(...exports.generateMerchantRows(adventure));
			components = components.slice(0, MAX_MESSAGE_ACTION_ROWS - 2);
			if (isCombatVictory) {
				components.push(exports.generateLootRow(adventure));
			}
			if (!hasEnemies || isCombatVictory) {
				components.push(exports.generateRoutingRow(adventure));
			}
		} else {
			// Defeat
			addScoreField(roomEmbed, adventure);
			components = [];

		}
	} else {
		// Victory
		addScoreField(roomEmbed, adventure);
		components = [new MessageActionRow().addComponents(
			new MessageButton().setCustomId("viewcollectartifact")
				.setLabel("Collect Artifact")
				.setStyle("SUCCESS")
		)];
	}
	return {
		embeds: [roomEmbed],
		components
	}
}

/** The score breakdown is added to a room embed to show how the players in the just finished adventure did
 * @param {MessageEmbed} embed
 * @param {Adventure} adventure
 */
function addScoreField(embed, adventure) {
	const isSuccess = adventure.lives > 0 && adventure.depth > getLabyrinthProperty(adventure.labyrinth, "maxDepth");
	const livesScore = adventure.lives * 10;
	const goldScore = Math.floor(Math.log10(adventure.peakGold)) * 5;
	let score = adventure.accumulatedScore + livesScore + goldScore + adventure.depth;
	let challengeMultiplier = 1;
	Object.keys(adventure.challenges).forEach(challengeName => {
		const challenge = getChallenge(challengeName);
		challengeMultiplier *= challenge.scoreMultiplier;
	})
	score *= challengeMultiplier;
	if (!isSuccess) {
		embed.setTitle(`Defeated${adventure.room.title ? ` in ${adventure.room.title}` : " before even starting"}`);
		score = Math.floor(score / 2);
	} else {
		embed.setTitle(`Success in ${adventure.labyrinth}`);
	}
	const skippedStartingArtifactMultiplier = 1 + (adventure.delvers.reduce((count, delver) => delver.startingArtifact ? count : count + 1, 0) / adventure.delvers.length);
	score = Math.max(1, score * skippedStartingArtifactMultiplier);
	embed.addField("Score Breakdown", `Depth: ${adventure.depth}\nLives: ${livesScore}\nGold: ${goldScore}\nBonus: ${adventure.accumulatedScore}\nChallenges Multiplier: ${challengeMultiplier}\nMultiplier (Skipped Starting Artifacts): ${skippedStartingArtifactMultiplier}\n\n__Total__: ${!isSuccess && score > 0 ? `score ÷ 2  = ${score} (Defeat)` : score}`);
	adventure.accumulatedScore = score;
}

/** A room embed's author field contains the most important or commonly viewed party resources and stats
 * @param {Adventure} adventure
 * @returns {string} text to put in the author name field of a room embed
 */
function roomHeaderString({ lives, gold, accumulatedScore }) {
	return `Lives: ${lives} - Party Gold: ${gold} - Score: ${accumulatedScore}`;
}

/** The room header goes in the embed's author field and should contain information about the party's commonly used or important resources
 * @param {Adventure} adventure
 * @param {Message} message
 */
//TODO make updateRoomHeader private
exports.updateRoomHeader = function (adventure, message) {
	message.edit({ embeds: message.embeds.map(embed => embed.setAuthor({ name: roomHeaderString(adventure), iconURL: message.client.user.displayAvatarURL() })) })
}

//TODO make generateRoutingRow private
exports.generateRoutingRow = function (adventure) {
	const candidateKeys = Object.keys(adventure.roomCandidates);
	if (candidateKeys.length > 1) {
		return new MessageActionRow().addComponents(
			...candidateKeys.map(candidateTag => {
				const [roomType, depth] = candidateTag.split(SAFE_DELIMITER);
				return new MessageButton().setCustomId(`routevote${SAFE_DELIMITER}${candidateTag}`)
					.setLabel(`Next room: ${roomType}`)
					.setStyle("SECONDARY")
			}));
	} else {
		return new MessageActionRow().addComponents(
			new MessageButton().setCustomId("continue")
				.setEmoji("👑")
				.setLabel(`Continue to the ${candidateKeys[0].split(SAFE_DELIMITER)[0]}`)
				.setStyle("SECONDARY")
		);
	}
}

//TODO make generateLootRow private
exports.generateLootRow = function (adventure) {
	let options = [];
	for (const { name, resourceType: type, count, visibility } of Object.values(adventure.room.resources)) {
		if (visibility === "loot") {
			if (count > 0) {
				let option = { value: `${name}${SAFE_DELIMITER}${options.length}` };

				if (name == "gold") {
					option.label = `${count} Gold`;
				} else {
					option.label = `${name} x ${count}`;
				}

				if (type === "equipment") {
					option.description = buildEquipmentDescription(name, false);
				} else if (type === "artifact") {
					option.description = getArtifact(name).dynamicDescription(count);
				} else {
					option.description = "";
				}
				options.push(option)
			}
		}
	}
	if (options.length > 0) {
		return new MessageActionRow().addComponents(
			new MessageSelectMenu().setCustomId("loot")
				.setPlaceholder("Take some of the spoils of combat...")
				.setOptions(options))
	} else {
		return new MessageActionRow().addComponents(
			new MessageSelectMenu().setCustomId("loot")
				.setPlaceholder("No loot")
				.setOptions([{ label: "If the menu is stuck, close and reopen the thread.", description: "This usually happens when two players try to take the last thing at the same time.", value: "placeholder" }])
				.setDisabled(true)
		)
	}
}

exports.generateTreasureRow = function (adventure) {
	let options = [];
	for (const { name, resourceType: type, count, visibility } of Object.values(adventure.room.resources)) {
		if (visibility === "internal" && type !== "roomAction") {
			if (count > 0) {
				let option = { value: `${name}${SAFE_DELIMITER}${options.length}` };

				if (name === "gold") {
					option.label = `${count} Gold`;
				} else {
					option.label = `${name} x ${count}`;
				}

				if (type === "equipment") {
					option.description = buildEquipmentDescription(name, false);
				} else if (type === "artifact") {
					option.description = getArtifact(name).dynamicDescription(count);
				} else {
					option.description = "";
				}
				options.push(option)
			}
		}
	}
	if (options.length > 0) {
		return new MessageActionRow().addComponents(
			new MessageSelectMenu().setCustomId("treasure")
				.setPlaceholder("Pick 1 treasure to take...")
				.setOptions(options))
	} else {
		return new MessageActionRow().addComponents(
			new MessageSelectMenu().setCustomId("treasure")
				.setPlaceholder("No treasure")
				.setOptions([{ label: "If the menu is stuck, close and reopen the thread.", description: "This usually happens when two players try to take the last thing at the same time.", value: "placeholder" }])
				.setDisabled(true)
		)
	}
}

//TODO make generateMerchantRows private
exports.generateMerchantRows = function (adventure) {
	let categorizedResources = {};
	for (const { name, visibility, uiGroup } of Object.values(adventure.room.resources)) {
		if (visibility === "always") {
			if (categorizedResources[uiGroup]) {
				categorizedResources[uiGroup].push(name);
			} else {
				categorizedResources[uiGroup] = [name];
			}
		}
	}

	let rows = [];
	for (const groupName in categorizedResources) {
		if (groupName.startsWith("equipment")) {
			const [type, tier] = groupName.split(SAFE_DELIMITER);
			let options = [];
			categorizedResources[groupName].forEach((resource, i) => {
				if (adventure.room.resources[resource].count > 0) {
					const cost = getEquipmentProperty(resource, "cost");
					options.push({
						label: `${cost}g: ${resource}`,
						description: buildEquipmentDescription(resource, false),
						value: `${resource}${SAFE_DELIMITER}${i}`
					})
				}
			})
			if (options.length) {
				rows.push(new MessageActionRow().addComponents(
					new MessageSelectMenu().setCustomId(`buy${groupName}`)
						.setPlaceholder(`Check a ${tier === "Rare" ? "rare " : ""}piece of equipment...`)
						.setOptions(options)));
			} else {
				rows.push(new MessageActionRow().addComponents(
					new MessageSelectMenu().setCustomId(`buy${groupName}`)
						.setPlaceholder("SOLD OUT")
						.setOptions([{ label: "If the menu is stuck, close and reopen the thread.", description: "This usually happens when two players try to buy the last item at the same time.", value: "placeholder" }])
						.setDisabled(true)));
			}
		} else if (groupName === "scouting") {
			const bossScoutingCost = adventure.room.resources.bossScouting.cost;
			const guardScoutingCost = adventure.room.resources.guardScouting.cost;
			rows.push(new MessageActionRow().addComponents(
				new MessageButton().setCustomId(`buyscouting${SAFE_DELIMITER}Final Battle`)
					.setLabel(`${adventure.scouting.finalBoss ? `Final Battle: ${adventure.finalBoss}` : `${bossScoutingCost}g: Scout the Final Battle`}`)
					.setStyle("SECONDARY")
					.setDisabled(adventure.scouting.finalBoss || adventure.gold < bossScoutingCost),
				new MessageButton().setCustomId(`buyscouting${SAFE_DELIMITER}Artifact Guardian`)
					.setLabel(`${guardScoutingCost}g: Scout the ${ordinalSuffixEN(adventure.scouting.artifactGuardians + 1)} Artifact Guardian`)
					.setStyle("SECONDARY")
					.setDisabled(adventure.gold < guardScoutingCost)
			));
		}
	}
	return rows;
}

/** Modify the buttons whose `customId`s are keys in `edits` from among `components` based on `preventUse`, `label`, and `emoji` then return all components
 * @param {MessageActionRow[]} components
 * @param {object} edits - customId as key to object with { preventUse, label, [emoji] }
 * @returns {MessageActionRow[]} the components of the message with the button edited
 */
exports.editButtons = function (components, edits) {
	return components.map(row => {
		return new MessageActionRow().addComponents(...row.components.map(component => {
			let customId = component.customId;
			if (customId in edits) {
				const { preventUse, label, emoji } = edits[customId];
				let editedButton = component.setDisabled(preventUse)
					.setLabel(label);
				if (emoji) {
					editedButton.setEmoji(emoji);
				}
				return editedButton;
			} else {
				return component;
			}
		}));
	})
}
