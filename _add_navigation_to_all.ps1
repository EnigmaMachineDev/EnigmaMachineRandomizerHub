# Script to add navigation sidebar to all randomizer index.html files

$randomizers = @(
    "Starcraft1Randomizer",
    "NoMansSkyRandomizer",
    "MtgRandomizer",
    "DarkSoulsRandomizer",
    "DarkSouls2Randomizer",
    "DarkSouls3CharacterRandomizer",
    "Civ5Randomizer",
    "EldenRingCharacterRandomizer",
    "EliteDangerousRandomizer",
    "GrimDawnCharacterRandomizer",
    "LiesOfPRandomizer",
    "PathOfExile2CharacterRandomizer",
    "SoulframeLoadoutRandomizer",
    "SpaceMarine2LoadoutRandomizer",
    "SkyrimCharacterRandomizer",
    "WarframeLoadoutRandomizer",
    "RealmOfTheMadGodRandomizer",
    "ArtworkMediaRandomizer",
    "CharacterPersonalityRandomizer",
    "CoffeeRandomizer",
    "HotSauceMakingRandomizer",
    "TeaRandomizer",
    "BakingRandomizer",
    "TravelRandomizer",
    "HomebrewingWineRandomizer",
    "BeerBrewingRandomizer",
    "DistillingRandomizer",
    "BrewingRandomizer",
    "NumberRandomizer",
    "OptionPicker",
    "DiceRoller",
    "BYOR"
)

$navHTML = @'
    <!-- Hamburger Menu Button -->
    <button class="sidebar-toggle" id="sidebar-toggle">☰</button>
    
    <!-- Navigation Sidebar -->
    <nav class="sidebar" id="sidebar">
        <div class="sidebar-content">
            <h3 class="sidebar-title">Quick Links</h3>
            
            <div class="nav-category">
                <button class="nav-category-btn">Generic Tools ▼</button>
                <div class="nav-links">
                    <a href="../NumberRandomizer/">Number Randomizer</a>
                    <a href="../OptionPicker/">Option Picker</a>
                    <a href="../DiceRoller/">Dice Roller</a>
                    <a href="../BYOR/">Build Your Own</a>
                </div>
            </div>
            
            <div class="nav-category">
                <button class="nav-category-btn">Gaming ▼</button>
                <div class="nav-links">
                    <a href="../DarkSoulsRandomizer/">Dark Souls</a>
                    <a href="../DarkSouls2Randomizer/">Dark Souls 2</a>
                    <a href="../DarkSouls3CharacterRandomizer/">Dark Souls 3</a>
                    <a href="../Civ5Randomizer/">Civilization 5</a>
                    <a href="../EldenRingCharacterRandomizer/">Elden Ring</a>
                    <a href="../EliteDangerousRandomizer/">Elite Dangerous</a>
                    <a href="../GrimDawnCharacterRandomizer/">Grim Dawn</a>
                    <a href="../LiesOfPRandomizer/">Lies of P</a>
                    <a href="../PathOfExile2CharacterRandomizer/">Path of Exile 2</a>
                    <a href="../SoulframeLoadoutRandomizer/">Soulframe</a>
                    <a href="../SpaceMarine2LoadoutRandomizer/">Space Marine 2</a>
                    <a href="../SatisfactoryRandomizer/">Satisfactory</a>
                    <a href="../SkyrimCharacterRandomizer/">Skyrim</a>
                    <a href="../WarframeLoadoutRandomizer/">Warframe</a>
                    <a href="../RealmOfTheMadGodRandomizer/">Realm of the Mad God</a>
                    <a href="../MtgRandomizer/">Magic: The Gathering</a>
                    <a href="../Starcraft2Randomizer/">StarCraft II</a>
                    <a href="../Starcraft1Randomizer/">StarCraft 1</a>
                    <a href="../NoMansSkyRandomizer/">No Man's Sky</a>
                </div>
            </div>
            
            <div class="nav-category">
                <button class="nav-category-btn">Creative ▼</button>
                <div class="nav-links">
                    <a href="../ArtworkMediaRandomizer/">Artwork Medium</a>
                    <a href="../CharacterPersonalityRandomizer/">Character Creator</a>
                </div>
            </div>
            
            <div class="nav-category">
                <button class="nav-category-btn">Cooking ▼</button>
                <div class="nav-links">
                    <a href="../CoffeeRandomizer/">Coffee</a>
                    <a href="../HotSauceMakingRandomizer/">Hot Sauce</a>
                    <a href="../TeaRandomizer/">Tea</a>
                    <a href="../BakingRandomizer/">Baking</a>
                </div>
            </div>
            
            <div class="nav-category">
                <button class="nav-category-btn">Life ▼</button>
                <div class="nav-links">
                    <a href="../TravelRandomizer/">Travel</a>
                </div>
            </div>
            
            <div class="nav-category">
                <button class="nav-category-btn">Home Brewing ▼</button>
                <div class="nav-links">
                    <a href="../HomebrewingWineRandomizer/">Wine</a>
                    <a href="../BeerBrewingRandomizer/">Beer</a>
                    <a href="../DistillingRandomizer/">Distilling</a>
                    <a href="../BrewingRandomizer/">Brewing (All)</a>
                </div>
            </div>
        </div>
    </nav>

'@

$navScript = @'
    <script>
        // Sidebar toggle functionality
        const sidebar = document.getElementById('sidebar');
        const sidebarToggle = document.getElementById('sidebar-toggle');
        const navCategoryBtns = document.querySelectorAll('.nav-category-btn');

        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            document.body.classList.toggle('sidebar-open');
        });

        // Close sidebar when clicking outside
        document.addEventListener('click', (e) => {
            if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
                sidebar.classList.remove('open');
                document.body.classList.remove('sidebar-open');
            }
        });

        // Category dropdown functionality
        navCategoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const category = btn.parentElement;
                category.classList.toggle('expanded');
            });
        });
    </script>
'@

foreach ($randomizer in $randomizers) {
    $indexPath = Join-Path $randomizer "index.html"
    
    if (Test-Path $indexPath) {
        Write-Host "Processing $randomizer..." -ForegroundColor Green
        
        $content = Get-Content $indexPath -Raw
        
        # Check if navigation already exists
        if ($content -match 'sidebar-toggle') {
            Write-Host "  Navigation already exists, skipping..." -ForegroundColor Yellow
            continue
        }
        
        # Add nav-styles.css link if not present
        if ($content -notmatch 'nav-styles.css') {
            $content = $content -replace '(<link rel="stylesheet" href="style.css">)', '$1`n    <link rel="stylesheet" href="../templates/nav-styles.css">'
        }
        
        # Add navigation HTML after <body>
        $content = $content -replace '(<body>)', ('$1' + "`n" + $navHTML + "`n")
        
        # Add navigation script before </body>
        $content = $content -replace '(</body>)', ($navScript + "`n" + '$1')
        
        # Save the file
        Set-Content -Path $indexPath -Value $content -NoNewline
        
        Write-Host "  Added navigation to $randomizer" -ForegroundColor Cyan
    } else {
        Write-Host "  $indexPath not found, skipping..." -ForegroundColor Red
    }
}

Write-Host "`nDone! Navigation added to all randomizers." -ForegroundColor Green
