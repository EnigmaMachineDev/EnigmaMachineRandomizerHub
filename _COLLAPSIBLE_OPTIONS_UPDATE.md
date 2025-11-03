# Collapsible Options Update

## Overview
Updated all randomizer options pages to use collapsible categories to reduce scrolling and improve usability.

## Key Features

### 1. Collapsible Categories
- Each category (Weapons, Armor, Spells, etc.) is now in its own collapsible section
- Click the category header to expand/collapse
- Visual indicator (▼ arrow) rotates when collapsed
- Smooth animations for expand/collapse

### 2. Category Controls
- **Select All / Deselect All** buttons at category level
- Item count displayed in category header (e.g., "Weapons (450 items)")
- Per-category selection without affecting other categories

### 3. Global Controls
- **Expand All / Collapse All** buttons to control all categories at once
- **Select All / Deselect All** buttons for all items across all categories
- **Save & Return** / **Reset to Defaults** buttons

## Visual Design

### Category Section Structure
```
┌─────────────────────────────────────────────────┐
│ Category Name (X items)                      ▼  │ ← Clickable header
├─────────────────────────────────────────────────┤
│ [Select All] [Deselect All]                     │ ← Category controls
├─────────────────────────────────────────────────┤
│ ☑ Item 1    ☑ Item 2    ☑ Item 3               │
│ ☑ Item 4    ☑ Item 5    ☑ Item 6               │ ← Options grid (collapsible)
│ ...                                              │
└─────────────────────────────────────────────────┘
```

### Color Scheme
- Category header: `#2a2a2a` (hover: `#333`)
- Category title: `#88e888` (light green)
- Item count: `#999` (gray)
- Collapse icon: `#66cc66` (green)
- Section border: `#333`
- Background: `#1a1a1a`

## Implementation Details

### HTML Changes
- Replaced `<div id="options-grid">` with `<div id="categories-container">`
- Added Expand All / Collapse All buttons
- Added extensive CSS for collapsible sections

### JavaScript Changes
- `addCategory()` now creates full section with header, controls, and grid
- Added `expandAllBtn` and `collapseAllBtn` event listeners
- Category header click toggles `.collapsed` class
- Per-category Select/Deselect buttons

### CSS Classes
- `.category-section` - Container for each category
- `.category-header` - Clickable header with title and icon
- `.category-title` - Title text with item count
- `.category-count` - Item count badge
- `.collapse-icon` - Rotating arrow indicator
- `.category-controls` - Select/Deselect buttons per category
- `.category-btn` - Button styling for category controls
- `.options-grid` - Grid of checkboxes (max-height animated)
- `.collapsed` - Applied to hide grid content

## Files Updated

### Template Files (in _shared/)
- `collapsible-options.html` - Complete HTML template
- `collapsible-options.js` - Complete JavaScript template

### Randomizers Updated
1. ✅ EldenRingCharacterRandomizer
2. ⏳ CoffeeRandomizer
3. ⏳ TeaRandomizer
4. ⏳ TravelRandomizer
5. ⏳ BakingRandomizer
6. ⏳ BeerBrewingRandomizer
7. ⏳ BrewingRandomizer
8. ⏳ DistillingRandomizer
9. ⏳ HomebrewingWineRandomizer
10. ⏳ HotSauceMakingRandomizer
11. ⏳ Civ5Randomizer
12. ⏳ CharacterPersonalityRandomizer
13. ⏳ DarkSouls3CharacterRandomizer
14. ⏳ GrimDawnCharacterRandomizer
15. ⏳ LiesOfPRandomizer
16. ⏳ PathOfExile2CharacterRandomizer
17. ⏳ RealmOfTheMadGodRandomizer
18. ⏳ SkyrimCharacterRandomizer
19. ⏳ SoulframeLoadoutRandomizer
20. ⏳ SpaceMarine2LoadoutRandomizer
21. ⏳ WarframeLoadoutRandomizer
22. ⏳ ArtworkMediaRandomizer

## How to Apply to Remaining Randomizers

### Step 1: Update options.html
Copy the CSS styles from `_shared/collapsible-options.html` (lines 55-167) to replace the existing styles in each randomizer's `options.html`.

Key changes:
- Add `.category-section`, `.category-header`, `.category-title`, `.category-count`, `.collapse-icon`, `.category-controls`, `.category-btn`, `.expand-collapse-all` styles
- Update `.options-grid` to include `max-height: 0` and transition
- Add `.category-section:not(.collapsed) .options-grid` rule

### Step 2: Update options.html structure
Replace:
```html
<div class="options-grid" id="options-grid"></div>
```

With:
```html
<div class="expand-collapse-all">
    <button class="btn btn-secondary" id="expand-all">Expand All</button>
    <button class="btn btn-secondary" id="collapse-all">Collapse All</button>
</div>
<div id="categories-container"></div>
```

### Step 3: Update options.js
Replace the entire `options.js` file with the template from `_shared/collapsible-options.js`, updating only:
- `STORAGE_KEY` constant (e.g., 'coffeeOptions', 'teaOptions', etc.)
- JSON file name if different (most use 'randomizer.json', ArtworkMedia uses 'mediums.json')

## Benefits
- **Reduced Scrolling**: Categories start collapsed, showing only headers
- **Better Organization**: Clear visual separation between categories
- **Faster Navigation**: Expand only the categories you need
- **Item Counts**: See how many items are in each category at a glance
- **Granular Control**: Select/deselect entire categories quickly
- **Improved UX**: Smooth animations and clear visual feedback

## Browser Compatibility
- Modern browsers (Chrome, Firefox, Edge, Safari)
- CSS transitions and flexbox
- ES6 JavaScript (arrow functions, template literals, const/let)
- LocalStorage API
