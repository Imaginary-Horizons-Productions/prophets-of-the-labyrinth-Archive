const Labyrinth = require("../../Classes/Labyrinth");

module.exports = new Labyrinth("Debug Dungeon", "Untyped", 10, [10])
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
				Cursed: [
				],
				Common: [
					"Buckler",
					"Certain Victory",
					"Infinite Regeneration",
					"Lance",
					"Vigilance Charm",
					"Warhammer"
				],
				Rare: [
					"Devoted Buckler",
					"Heavy Buckler",
					"Guarding Buckler",
					"Hunter's Certain Victory",
					"Lethal Certain Victory",
					"Reckless Certain Victory",
					"Fate Sealing Infinite Regeneration",
					"Accelerating Lance",
					"Piercing Lance",
					"Vigilant Lance",
					"Devoted Vigilance Charm",
					"Long Vigilance Charm",
					"Guarding Vigilance Charm",
					"Piercing Warhammer",
					"Slowing Warhammer"
				]
			},
			Wind: {
				Cursed: [
				],
				Common: [
					"Bow",
					"Cloak",
					"Daggers",
					"Floating Mist Stance",
					"Inspiration",
					"Iron Fist Stance",
					"Scythe",
					"Spear",
					"Sun Flare"
				],
				Rare: [
					"Evasive Bow",
					"Hunter's Bow",
					"Mercurial Bow",
					"Accelerating Cloak",
					"Long Cloak",
					"Thick Cloak",
					"Sharpened Daggers",
					"Slowing Daggers",
					"Sweeping Daggers",
					"Soothing Floating Mist Stance",
					"Reinforcing Inspiration",
					"Soothing Inspiration",
					"Sweeping Inspiration",
					"Organic Iron Fist Stance",
					"Lethal Scythe",
					"Piercing Scythe",
					"Toxic Scythe",
					"Lethal Spear",
					"Reactive Spear",
					"Sweeping Spear",
					"Evasive Sun Flare",
					"Accelerating Sun Flare",
					"Tormenting Sun Flare"
				]
			},
			Water: {
				Cursed: [
				],
				Common: [
					"Blood Aegis",
					"Life Drain",
					"Midas Staff",
					"Potion Kit",
					"Sickle"
				],
				Rare: [
					"Charging Blood Aegis",
					"Heavy Blood Aegis",
					"Sweeping Blood Aegis",
					"Flanking Life Drain",
					"Reactive Life Drain",
					"Urgent Life Drain",
					"Soothing Midas Staff",
					"Accelerating Midas Staff",
					"Guarding Potion Kit",
					"Organic Potion Kit",
					"Urgent Potion Kit",
					"Hunter's Sickle",
					"Sharpened Sickle",
					"Toxic Sickle"
				]
			},
			Fire: {
				Cursed: [
				],
				Common: [
					"Barrier",
					"Battleaxe",
					"Censer",
					"Corrosion",
					"Firecracker",
					"Scutum",
					"Shortsword",
					"War Cry"
				],
				Rare: [
					"Purifying Barrier",
					"Thick Barrier",
					"Urgent Barrier",
					"Prideful Battleaxe",
					"Thick Battleaxe",
					"Thirsting Battleaxe",
					"Fate Sealing Censer",
					"Thick Censer",
					"Tormenting Censer",
					"Flanking Corrosion",
					"Double Firecracker",
					"Mercurial Firecracker",
					"Toxic Firecracker",
					"Heavy Scutum",
					"Sweeping Scutum",
					"Vigilant Scutum",
					"Accelerating Shortsword",
					"Toxic Shortsword",
					"Charging War Cry",
					"Slowing War Cry",
					"Tormenting War Cry"
				]
			},
			Untyped: {
				Cursed: [
				],
				Common: [
				],
				Rare: [
				]
			}
		})
	.setRooms(
		{
			"Event": ["Twin Pedestals", "Elemental Research", "Free Gold?", "Health Redistribution", "The Score Beggar", "Repair Kit, just hanging out", "Abandoned Forge", "Equipment Merchant", "Consumable Merchant", "Overpriced Merchant", "Rest Site", "Treasure! Artifact or Gold?"],
			"Battle": ["Hawk Fight", "Frog Fight", "Mechabee Fight", "Slime Fight", "Tortoise Fight"],
			"Merchant": ["Equipment Merchant", "Consumable Merchant", "Overpriced Merchant"],
			"Rest Site": ["Rest Site"],
			"Final Battle": ["A Northern Laboratory", "Hall of Mirrors", "The Hexagon"],
			"Forge": ["Abandoned Forge"],
			"Artifact Guardian": ["A Slimy Throneroom", "A windfall of treasure!"],
			"Treasure": ["Treasure! Artifact or Equipment?", "Treasure! Artifact or Gold?", "Treasure! Artifact or Consumables?", "Treasure! Equipment or Consumables?", "Treasure! Gold or Equipment?", "Treasure! Gold or Consumables?"],
			"Empty": ["Empty Room"]
		}
	);
