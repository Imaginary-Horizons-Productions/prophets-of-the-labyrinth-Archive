const Labyrinth = require("../../Classes/Labyrinth");

module.exports = new Labyrinth("Debug Dungeon", "Untyped")
	.setConsumables(
		{
			Earth: [],
			Fire: [],
			Water: [],
			Wind: [],
			Untyped: [
				"Block Potion",
				"Earthen Potion",
				"Explosion Potion",
				"Fiery Potion",
				"Health Potion",
				"Salt of Oblivion",
				"Quick Pepper",
				"Regen Root",
				"Repair Kit",
				"Smoke Bomb",
				"Stasis Quartz",
				"Strength Spinach",
				"Vitamins",
				"Watery Potion",
				"Windy Potion"
			]
		})
	.setEquipment(
		{
			Earth: {
				"Cursed": [
				],
				"Common": [
					"Buckler",
					"Infinite Regeneration",
					"Sword",
					"Vigilance Charm",
					"Warhammer"
				],
				"Rare": [
					"Guarding Buckler",
					"Heavy Buckler",
					"Urgent Buckler",
					"Guarding Sword",
					"Reckless Sword",
					"Accelerating Sword",
					"Devoted Vigilance Charm",
					"Long Vigilance Charm",
					"Guarding Vigilance Charm",
					"Piercing Warhammer"
				]
			},
			Wind: {
				"Cursed": [
				],
				"Common": [
					"Bow",
					"Cloak",
					"Daggers",
					"Inspiration",
					"Scythe"
				],
				"Rare": [
					"Evasive Bow",
					"Hunter's Bow",
					"Mercurial Bow",
					"Long Cloak",
					"Accelerating Cloak",
					"Thick Cloak",
					"Sharpened Daggers",
					"Sweeping Daggers",
					"Wicked Daggers",
					"Reinforcing Inspiration",
					"Soothing Inspiration",
					"Sweeping Inspiration",
					"Lethal Scythe",
					"Piercing Scythe",
					"Toxic Scythe"
				]
			},
			Water: {
				"Cursed": [
				],
				"Common": [
					"Blood Aegis",
					"Ice Ward",
					"Life Drain",
					"Midas Staff",
					"Potion Kit",
					"Sickle"
				],
				"Rare": [
					"Charging Blood Aegis",
					"Heavy Boold Aegis",
					"Sweeping Blood Aegis",
					"Heavy Ice Ward",
					"Sweeping Ice Ward",
					"Flanking Life Drain",
					"Reactive Life Drain",
					"Urgent Life Drain",
					"Soothing Midas Staff",
					"Accelerating Midas Staff",
					"Hunter's Sickle",
					"Sharpened Sickle",
					"Thick Sickle"
				]
			},
			Fire: {
				"Cursed": [
				],
				"Common": [
					"Barrier",
					"Battleaxe",
					"Censer",
					"Corrosion",
					"Firecracker",
					"Spear",
					"Sun Flare"
				],
				"Rare": [
					"Purifying Barrier",
					"Thick Barrier",
					"Urgent Barrier",
					"Prideful Battleaxe",
					"Thick Battleaxe",
					"Thirsting Battleaxe",
					"Flanking Corrosion",
					"Double Firecracker",
					"Mercurial Firecracker",
					"Toxic Firecracker",
					"Lethal Spear",
					"Reactive Spear",
					"Sweeping Spear",
					"Evasive Sun Flare",
					"Accelerating Sun Flare",
					"Tormenting Sun Flare"
				]
			},
			Untyped: {
				"Cursed": [
				],
				"Common": [
				],
				"Rare": [
				]
			}
		})
	// .setRooms([

	// ]);
