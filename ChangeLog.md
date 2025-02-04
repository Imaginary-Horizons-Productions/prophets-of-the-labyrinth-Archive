# Prophets of the Labyrinth Change Log
#### Prophets of the Labyrinth Version 0.11.1:
- added `/regenerate` command, which resends the current room's message and UI
- tweaked room rarities, largely made Treasure rooms Rarer
- Ritualist's target selection helper text now shows if the target has debuffs or not
- Buffed gear durability across the board by 50% or more (except Toxic Sickle, which had more durability than its peers)
- Reworked Martial Artist starting gear
   - Iron Fist Stance: increases Punch damage and changes it to your element
   - Floating Mist Stance: grants Evade each turn and increases Punch inflicted by Stagger
- Treasure rooms now have a random 2 of the following four options (players can still only pick one):
   - an artifact
   - 1 of 2 pieces of equipment
   - a large sum of gold
   - a pair of consumables
- New Gear Variants:
   - Discounted Infinite Regeneration
   - Discounted Midas Staff
   - Reactive Warhammer
#### Prophets of the Labyrinth Verison 0.11.0:
- New Archetype: Legionnaire
   - Element: Fire; Predicts: Intents
   - Martial Artist changed to Wind
   - Converted *Spell: Ice Ward* to *Scutum* (Legionnaire's starting defensive gear)
- Reworked the Knight
   - Sword renamed to Lance and now double benefits from Power Up instead of granting it (upgrades: Accelerating, Piercing, Vigilant)
   - Buckler now grants Power Up (Urgent upgrade changed to Devoted)
   - Old Sword (weapon that grants user Power Up) has been reworked to Pact: Certain Victory (upgrades: Hunter's, Lethal, Reckless)
- New Artifacts: *Piggy Bank*, *Crystal Shard*
- Reduced base damage of *Warhammer* (and upgrades) from 100 to 75
- New Gear Variants: *Fate Sealing Censer*, *Fate Sealing Infinite Regeneration*, *Slowing Warhammer*, *Slowing War Cry*, and *Organic Potion Kit*
- Reworked *Blood Aegis*: now always adds block to self and forces an enemy to target the user if the enemy is using a single target move after the user
- *Reckless* gear variants (and *Battleaxes*) now have high base damage and apply *Exposed* to the user
- Fixed Potion Kit upgrades cost being the same as the unupgraded Potion Kit
- *Daggers* can now upgrade to *Slowing Daggers* instead of *Wicked Daggers*
- *Punch* is now always available unless the delver is full on gear (damage reduced to 35 to be less than the average resisted damage)
- Adventures that end by `/give-up` no longer provide score to player profiles
- Merchants now show how many uses equipment they're selling has
- New Challenge: Rushing - adds a chance to not know the type of a route option
- Player high scores are now tracked per archetype (view in `/stats`)
- Added 2 new Event rooms and 2 new Merchant rooms
- Amethyst Spyglass now reduces scouting costs by 15g per spyglass (and can't reduce past 0g)
- Scouting Artifact Guardians will now always start with the next upcoming Artifact Guardian
- Element Redistrabution event (now named Elemental Research) now pays 200g instead of costing 100g
- Removed "wait for leader" decision points
   - Anyone can now pick a challenge at a rest site, make sure to discuss with the party!
   - Start of adventure now has a "Ready!" button instead of a confirmation after everyone's picked an archetype
   - Anyone can now `/give-up`
- Renamed `/delver-stats` to `/inspect-self` to match the button that does the same thing in combat
- Updated `armory` and `consumable-info` commands to now utilize Discord autocomplete

#### Prophets of the Labyrinth Version 0.10.0:
- Added **Consumables**: these resources can be used by any party member during combat at priority speed
   1. Vitamins
   2. Health Potion
   3. Repair Kit
   4. Smoke Bomb
   5. Explosion Potion
   6. Earthen Potion
   7. Fiery Potion
   8. Salt of Oblivion
   9. Quick Pepper
   10. Regen Root
   11. Stasis Quartz
   12. Strength Spinach
   13. Watery Potion
   14. Windy Potion
   15. Block Potion
- New command: `/consumables-info` for looking up information on consumables
- Reworked *Urgent* weapon variant: it now adds priority to the move
- Reworked *Unfinished Potion* to *Potion Kit*: it now adds a random "potion" consumable to loot (upgrades: Guarding, Urgent)
- Renamed *Swift* weapon variant to *Accelerating*
- The *Quicken* and *Slow* modifiers now grant/penalize speed scaling with their number of stacks
- Delvers can now use the default Punch move when they don't have a usable weapon (previously had to have no usable equipment)
- *Censer*s now gain their bonus when their targets have debuffs (instead of 0 block)
- Added *Tormenting Censer*
- Reworked Starting Artifact selections:
   - When starting an adventure, a pool of eligible artifacts will be rolled for each delver
   - Delvers will be able to bring an artifact from that pool if they've rolled it before
   - Each delver will have a different pool of eligible artifacts in each adventure
- Halved the effectiveness of *Hawk Tailfeather*
- Boss balance: ||The Elkemist's Bubble's Progress gain is now (0 to 15) + 5 per buff removed + 10 on crit||
- Fixed a bug where *Devoted Vigilance Charm* was always targeting the user
- Added *War Cry*, *Charging War Cry*, and *Tormenting War Cry*

#### Prophets of the Labyrinth Version 0.9.0:
- Rebalanced predicts, they are now as follows
   1. Movements - Speed, Stagger, and Poise for each combatant
   2. Vulnerabilties - Critical Hits and Elements for each combatant
   3. Intents - Targets and next two Move Names for enemies
   4. Health - HP and Modifiers for each combatant
- Removed Darkness and Light elements; enemies, weapons, and archetypes have been re-elemented
- Added Equipment categories ("Weapons" are now one category among them)
- New slash command: `/armory` that allows checking stats on a weapon given by name
- New modifiers: Stasis, Oblivious, Vigilance
- New Equipment: Vigilance Charm
- Slash commands can now be used from DMs (as long as they make sense)
- Max delvers per adventure reduced to 8 (UI constraint)
- The changelog no longer offers "premimum features" for sponsoring on GitHub
- Other bug fixes, optimizations, and improvements
- Fixed `/invite`
- Fixed `/ping` incorrectly mentioning delvers who are ready
#### Prophets of the Labyrinth Version 0.8.0:
- Added "Data Policy" page to manual
- Enemy hp now scales with party size
- Weapon durability tweaks:
   - Thick Battleaxe: 15 -> 20 durability
   - Cloaks (Base, Long, Swift): 5 -> 10 durability
   - Thick Cloak: 10 -> 20 durability
   - Midas Staves: 10 -> 5 durability
   - Potions: 5 -> 10 durability
   - Scythes: 15 -> 10 durability
   - Base Sword: 5 -> 10 durability
- Artifact performance stats can now be viewed in `/party-stats`
- Curse of Midas no longer triggers on Poison damage
- Other stuff
#### Prophets of the Labyrinth Version 0.7.1:
- New artifacts: Hawk Tail Feather
- New enemy: Fire-Arrow Frog
- Enemy balance:
   - Bloodtail Hawk critical hit rate increased from 1/4 to 1/3 and now scale in count with party size
   - Slimes and Oozes now scale in count less with party size
- Fixed crash on completing a challenge
- Other stuff
#### Prophets of the Labyrinth Version 0.7.0:
- Added challenges
   - These can be applied at the beginning of the run or at a rest site for a score bonus and other rewards
   - New challenges: Can't Hold All this Value, Restless, Blind Avarice
- New final battle: A Northern Laboratory
- `/stats` now shows if a player is available for adventures
- Reduced max hp % damage on Sickles from 10% to 5%
- Damage is now capped at 500 damage per instance, this can be exceeded by having Power Up
- Bot no longer creates a (no longer required) category and text channel for starting adventures in
- Allowed deselecting starting artifact
- Fixed healing reporting block gained while party has no Bloodshield Swords
- Fixed text interpolation for modifier descriptions with more than 1 dynamic value
- Fixed several multiplayer bugs
- Culled some unnecessary bot output
- Other stuff
### Known Issues
- Ready message is output twice if the last two players select their archetypes at similar times
- /ping returns false positives
- Interacting with archived threads sometimes causes crashes
- Poison damage procs Curse of Midas
- Using a join button in a /invite clears the original join button on the adventure
#### Prophets of the Labyrinth Version 0.6.0:
- New artifact: Negative-One Leaf Clover
- New weapons: Ice Ward, Heavy Ice Ward, Sweeping Ice Ward, Reinforcing Inspiration
- Participating in more than one adventure per server is now a premium perk
- Capped delvers in an adventure to 12
- Multiple Royal Slimes now appear in opposition to larger party sizes
- Fixed merchant rooms never rolling during room generation
#### Prophets of the Labyrinth Version 0.5.3:
- Fixed typo in rest site healing amount
- Fixed a crash on mechabee call for help
#### Prophets of the Labyrinth Version 0.5.2:
- Fixed a crash when enemies healed
- Health predict now shows element using emoji
#### Prophets of the Labyrinth Version 0.5.1:
- Fixed several crashes with `/reset`
- Fixed an issue where all readied moves were input for the wrong turn, and thus ignored
#### Prophets of the Labyrinth Version 0.5.0:
- Game name no longer references unsupported game genre
- Artifact Collecting: completing an adventure allows the delvers to save an artifact they found to bring into future adventures
- New artifact: Bloodshield Sword
- New weapons: Swift Midas Staff, Piercing Scythe
- Reworked Quicken and Slow: they now give/remove 10 speed and don't lose stacks on end of round
- Reworked Evade and Exposed: they now lose all stacks at end of round instead of 100, most sources of these modifiers now output more stacks
- Upgraded Potions now apply 5 Poison, up from 4 (10 on crit, up from 8)
- `/commands` - a new command for listing PotL's slash commands
- `/invite` - a new command for inviting friends to adventures
- `/manual` - a new command for getting information about the game
- `/ping` - a new command for sending a notification to players the game is waiting on input for
- Automated version notes and `/version` command
- Other stuff

#### Prophets of the Labyrinth Version 0.4.0:
- Check the repository for version notes pre-history
