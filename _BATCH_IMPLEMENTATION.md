# Batch Implementation Strategy

## Completed (2/27)
1. ✅ EldenRingCharacterRandomizer
2. ✅ CoffeeRandomizer

## Batch 1: Category-based randomizers (Tea, Travel, Baking, etc.) - 10 randomizers
These all have similar JSON structure with multiple categories of items.
- TeaRandomizer
- TravelRandomizer  
- BakingRandomizer
- BeerBrewingRandomizer
- BrewingRandomizer
- DistillingRandomizer
- HomebrewingWineRandomizer
- HotSauceMakingRandomizer
- Civ5Randomizer
- ArtworkMediaRandomizer

## Batch 2: Character/Loadout randomizers - 8 randomizers
Complex nested structures with multiple item types.
- DarkSouls3CharacterRandomizer
- GrimDawnCharacterRandomizer
- LiesOfPRandomizer
- PathOfExile2CharacterRandomizer
- RealmOfTheMadGodRandomizer
- SkyrimCharacterRandomizer
- SoulframeLoadoutRandomizer
- SpaceMarine2LoadoutRandomizer
- WarframeLoadoutRandomizer
- CharacterPersonalityRandomizer
- NoMansSkyRandomizer

## Batch 3: Special randomizers (no JSON) - 5 randomizers
- BibleRandomizer (API-based)
- DiceRoller (number-based)
- NumberRandomizer (range-based)
- OptionPicker (user input)

## Implementation per randomizer:
1. Copy options.html template
2. Create custom options.js for data structure
3. Add options link to index.html
4. Add .options-link CSS
5. Update script.js to use localStorage

Estimated time: ~5-10 minutes per randomizer = 2-4 hours total
