const { MessageActionRow, MessageButton, MessageSelectMenu } = require("discord.js");
const { SAFE_DELIMITER } = require("../constants.js");
const { ordinalSuffixEN } = require("../helpers");
const { getArtifact } = require("./Artifacts/_artifactDictionary");
const { buildEquipmentDescription, getEquipmentProperty } = require("./equipment/_equipmentDictionary");

exports.generateRoutingRow = function (adventure) {
	let candidateKeys = Object.keys(adventure.roomCandidates);
	if (candidateKeys.length > 1) {
		return new MessageActionRow().addComponents(
			...candidateKeys.map(candidateTag => {
				let [roomType, _depth] = candidateTag.split(SAFE_DELIMITER);
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

exports.generateLootRow = function (adventure) {
	let options = [];
	for (const resource of Object.values(adventure.room.resources)) {
		if (resource.uiType === "loot") {
			const { name, resourceType: type, count } = resource;
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

exports.generateMerchantRows = function (adventure) {
	let categorizedResources = {};
	for (const resource of Object.values(adventure.room.resources)) {
		if (resource.uiType === "merchant") {
			let group = resource.uiGroup;
			if (categorizedResources[group]) {
				categorizedResources[group].push(resource.name);
			} else {
				categorizedResources[group] = [resource.name];
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
						.setPlaceholder(`Check a ${tier === "2" ? "rare " : ""}piece of equipment...`)
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
