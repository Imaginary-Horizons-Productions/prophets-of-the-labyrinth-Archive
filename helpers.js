const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
const { Adventure } = require("./Classes/Adventure");

exports.versionData = {};
exports.sponsors = {};
exports.versionData = require('./Config/versionData.json');
exports.sponsors = require("./Config/sponsors.json");

const NUMBER_EMOJI = {
	0: '0️⃣',
	1: '1️⃣',
	2: '2️⃣',
	3: '3️⃣',
	4: '4️⃣',
	5: '5️⃣',
	6: '6️⃣',
	7: '7️⃣',
	8: '8️⃣',
	9: '9️⃣',
	10: '🔟'
};
/**
 * @param {number} number
 * @returns {string}
 */
exports.getNumberEmoji = function (number) {
	if (number in NUMBER_EMOJI) {
		return NUMBER_EMOJI[number];
	} else {
		return '#️⃣';
	}
}

/** Check if the given `id` belongs to a sponsor of the project
 * @param {string} id
 * @returns {boolean} if the id belongs to a sponsor
 */
exports.isSponsor = function (id) {
	let allSponsors = new Set();
	for (const group in exports.sponsors) {
		exports.sponsors[group].forEach(sponsorId => {
			if (!allSponsors.has(sponsorId)) {
				allSponsors.add(sponsorId);
			}
		})
	}
	return allSponsors.has(id);
}


/** Generate an integer between 0 and the given `exclusiveMax`
 * @param {Adventure} adventure the adventure in which to roll
 * @param {number} exclusiveMax the integer after the max roll
 * @param {"general" | "battle"} branch which rnTable branch to roll on
 * @returns {number} generated integer
 */
exports.generateRandomNumber = function (adventure, exclusiveMax, branch) {
	if (typeof exclusiveMax !== 'number' || isNaN(exclusiveMax)) {
		throw new Error(`generateRandomNumber recieved invalid exclusiveMax: ${exclusiveMax}`);
	}

	if (exclusiveMax === 1) {
		return 0;
	} else {
		const digits = Math.ceil(Math.log2(exclusiveMax) / Math.log2(12));
		const start = adventure.rnIndices[branch];
		const end = start + digits;
		adventure.rnIndices[branch] = end % adventure.rnTable.length;
		const max = 12 ** digits;
		const sectionLength = max / exclusiveMax;
		const roll = parseInt(adventure.rnTable.slice(start, end), 12);
		return Math.floor(roll / sectionLength);
	}
}

/** Create a text-only ratio bar that fills left to right
 * @param {number} numerator
 * @param {number} denominator
 * @param {number} barLength
 */
exports.generateTextBar = function (numerator, denominator, barLength) {
	const filledBlocks = Math.floor(barLength * numerator / denominator);
	let bar = "";
	for (let i = 0; i < barLength; i++) {
		if (filledBlocks > i) {
			bar += "▰";
		} else {
			bar += "▱";
		}
	}
	return bar;
}

const operationMap = {
	'+': (first, second) => first + second,
	'~': (first, second) => first - second,
	'*': (first, second) => first * second,
	'/': (first, second) => first / second,
	'^': (first, second) => first ** second,
};

/** Calculate the value represented by a mathematical expression (supported operations: addition, subtration, multiplication, division, power)
 * @param {string} expression
 * @param {number} nValue - the value to replace "n" with
 */
exports.parseExpression = function (expression, nValue) {
	const operations = expression.replace(/[^\+~\*/\^]/g, "");
	const terms = expression.split(/[\+~\*/\^]/g).map(term => term === "n" ? nValue : Number(term));
	return terms.reduce((total, term, index) => operationMap[operations[index - 1]](total, term));
}

/** Replace all @{tag}s in the text with the evaluation of the expression in the tag with n as count
 * @param {string} text
 * @param {{tag: string, count: number}[]} tags
 */
exports.calculateTagContent = function (text, tags) {
	for (const { tag, count } of tags) {
		const taggedGlobal = new RegExp(`@{(.*?${tag}.*?)}`, "g");
		const untagged = new RegExp(tag, "g");
		const taggedSingle = new RegExp(`@{(.*?${tag}.*?)}`);

		for (const match of text.matchAll(taggedGlobal)) {
			const countExpression = match?.[1].replace(untagged, "n");
			if (countExpression) {
				let parsedExpression = exports.parseExpression(countExpression, count);
				if (typeof parsedExpression === "number") {
					parsedExpression = parsedExpression.toFixed(2);
				}
				text = text.replace(taggedSingle, parsedExpression);
			}
		}
	}
	return text;
}

/** Create a message embed with common settings
 * @param {string} iconURL
 * @returns {MessageEmbed}
 */
exports.embedTemplate = function (iconURL) {
	return new EmbedBuilder().setColor('6b81eb')
		.setAuthor({ name: "Click here to vist the PotL GitHub", iconURL, url: "https://github.com/Imaginary-Horizons-Productions/prophets-of-the-labyrinth" })
		.setURL("https://discord.com/api/oauth2/authorize?client_id=950469509628702740&permissions=397284665360&scope=applications.commands%20bot")
		.setFooter({ text: "Click the title link to add PotL to your server", iconURL: "https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png" })
}


/** Remove components (buttons and selects) from a given message
 * @param {string} messageId - the id of the message to remove components from
 * @param {MessageManager} messageManager - the MessageManager for the channel the message is in
 */
exports.clearComponents = function (messageId, messageManager) {
	if (messageId) {
		messageManager.fetch(messageId).then(message => {
			message.edit({ components: [] });
		})
	}
}

/** Generate parent directories if necessary, and save a file.
 * Keeps a backup of the fileName that may be replaced, until writing succeeds
 * @param {string} dirPath path to the directory of a file
 * @param {string} fileName name of the file to be saved
 * @param {string} data string to be written to the file
 */
exports.ensuredPathSave = async function (dirPath, fileName, data) {
	const filePath = dirPath + "/" + fileName;
	const backupFilePath = filePath + ".bak";
	fs.promises.mkdir(dirPath, { recursive: true }) // (idempotently) establish prerequisite directory, in advance
		.then(() => fs.promises.rename(filePath, backupFilePath)) // save previous file as backup
		.catch((err) => err.code === 'ENOENT' ? undefined : Promise.reject(err)) // ignore ENOENT (file not found) for rename if save didn't already exist
		.then(() => fs.promises.writeFile(filePath, data, { encoding: "utf8" })
			.catch((err) => Promise.reject(new Error("writeFile failed", { cause: err })))) // promote errors (including ENOENT) for writeFile)
		.catch(console.error) // log error, and avoid fatally crashing
}

/** Calculates the English cojugation of the ordinal suffix (eg 1st, 2nd, 3rd)
 * @param {number} integer - the integer to calculate the suffix for
 * @returns {string}
 */
exports.ordinalSuffixEN = function (integer) {
	let lastDigit = integer % 10;
	let tensDigit = integer % 100 / 10;
	switch (lastDigit) {
		case 1:
			if (tensDigit !== 1) {
				return `${integer}st`;
			}
		case 2:
			if (tensDigit !== 1) {
				return `${integer}nd`;
			}
		case 3:
			if (tensDigit !== 1) {
				return `${integer}rd`;
			}
		default:
			return `${integer}th`;
	}
}

/** The version embed lists the following: changes in the most recent update, known issues in the most recent update, and links to support the project
 * @param {string} avatarURL
 * @returns {MessageEmbed}
 */
exports.getVersionEmbed = async function (avatarURL) {
	const data = await fs.promises.readFile('./ChangeLog.md', { encoding: 'utf8' });
	const dividerRegEx = /####/g;
	const changesStartRegEx = /\.\d+:/g;
	const knownIssuesStartRegEx = /### Known Issues/g;
	let titleStart = dividerRegEx.exec(data).index;
	changesStartRegEx.exec(data);
	let knownIssuesStart;
	let knownIssueStartResult = knownIssuesStartRegEx.exec(data);
	if (knownIssueStartResult) {
		knownIssuesStart = knownIssueStartResult.index;
	}
	let knownIssuesEnd = dividerRegEx.exec(data).index;

	const embed = new EmbedBuilder().setColor('6b81eb')
		.setAuthor({ name: "Click here to check out the Imaginary Horizons GitHub", iconURL: avatarURL, url: "https://github.com/Imaginary-Horizons-Productions" })
		.setTitle(data.slice(titleStart + 5, changesStartRegEx.lastIndex))
		.setURL('https://discord.gg/JxqE9EpKt9')
		.setThumbnail('https://cdn.discordapp.com/attachments/545684759276421120/734099622846398565/newspaper.png')
		.setFooter({ text: "Imaginary Horizons Productions", iconURL: "https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png" })
		.setTimestamp();

	if (knownIssuesStart && knownIssuesStart < knownIssuesEnd) {
		// Known Issues section found
		embed.setDescription(data.slice(changesStartRegEx.lastIndex, knownIssuesStart))
			.addFields({ name: "Known Issues", value: data.slice(knownIssuesStart + 16, knownIssuesEnd) });
	} else {
		// Known Issues section not found
		embed.setDescription(data.slice(changesStartRegEx.lastIndex, knownIssuesEnd));
	}
	return embed.addFields({ name: "Become a Sponsor", value: "Chip in for server costs or get premium features by sponsoring [PotL on GitHub](https://github.com/Imaginary-Horizons-Productions/prophets-of-the-labyrinth)" });
}
