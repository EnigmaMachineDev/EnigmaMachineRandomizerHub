import os
import re

# Directory containing randomizer folders
base_dir = r"c:\Users\William\EnigmaMachineDev\Repository\EnigmaMachineRandomizerHub"

# List of randomizer folders to update
randomizer_folders = [
    "ArtworkRandomizer", "BYOR", "BakingRandomizer", "BeerBrewingRandomizer",
    "BrewingRandomizer", "CharacterPersonalityRandomizer", "Civ5Randomizer",
    "CoffeeRandomizer", "DarkSouls2Randomizer", "DarkSouls3CharacterRandomizer",
    "DarkSoulsRandomizer", "DateIdeaRandomizer", "DiceRoller", "DistillingRandomizer",
    "EldenRingCharacterRandomizer", "EliteDangerousRandomizer", "GrimDawnCharacterRandomizer",
    "HobbyAndSkillRandomizer", "HomebrewingWineRandomizer", "HotSauceMakingRandomizer",
    "LiesOfPRandomizer", "MtgRandomizer", "MusicGenreRandomizer", "NoMansSkyRandomizer",
    "NumberRandomizer", "OptionPicker", "PathOfExile2CharacterRandomizer",
    "RealmOfTheMadGodRandomizer", "SatisfactoryRandomizer", "SkyrimCharacterRandomizer",
    "SoulframeLoadoutRandomizer", "SpaceMarine2LoadoutRandomizer", "Starcraft1Randomizer",
    "Starcraft2Randomizer", "TeaRandomizer", "TravelRandomizer", "WarframeLoadoutRandomizer",
    "Witcher3Randomizer"
]

# Navigation template loader script
nav_loader_script = """    <!-- Hamburger Menu Button -->
    <button class="sidebar-toggle" id="sidebar-toggle">☰</button>
    
    <!-- Navigation Sidebar -->
    <div id="nav-placeholder"></div>
    <script>
        fetch('../templates/navigation.html')
            .then(response => response.text())
            .then(data => {
                document.getElementById('nav-placeholder').innerHTML = data;
            });
    </script>
"""

def update_navigation(file_path):
    """Replace embedded navigation with template loader"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Pattern to match from hamburger button to end of nav section
        # This matches: <!-- Hamburger Menu Button --> through </nav> and its script
        pattern = r'    <!-- Hamburger Menu Button -->.*?</nav>\s*\n'
        
        # Check if the file already uses the template loader
        if 'nav-placeholder' in content:
            print(f"  Already using template: {file_path}")
            return False
        
        # Replace the embedded navigation with the loader
        new_content = re.sub(pattern, nav_loader_script + '\n', content, flags=re.DOTALL)
        
        if new_content != content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"  Updated: {file_path}")
            return True
        else:
            print(f"  No changes needed: {file_path}")
            return False
            
    except Exception as e:
        print(f"  Error updating {file_path}: {e}")
        return False

# Update all randomizer index.html files
print("Updating navigation in randomizer pages...\n")
updated_count = 0

for folder in randomizer_folders:
    index_path = os.path.join(base_dir, folder, "index.html")
    if os.path.exists(index_path):
        print(f"Processing {folder}...")
        if update_navigation(index_path):
            updated_count += 1
    else:
        print(f"  Skipped: {index_path} not found")

print(f"\nCompleted! Updated {updated_count} files.")
