# Script to fix CSS link spacing issues

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

foreach ($randomizer in $randomizers) {
    $indexPath = Join-Path $randomizer "index.html"
    
    if (Test-Path $indexPath) {
        Write-Host "Processing $randomizer..." -ForegroundColor Green
        
        $content = Get-Content $indexPath -Raw
        
        # Fix concatenated CSS links
        $content = $content -replace '(style\.css">)\s*(<link rel="stylesheet")', "`$1`r`n    `$2"
        
        # Save the file
        Set-Content -Path $indexPath -Value $content -NoNewline
        
        Write-Host "  Fixed CSS spacing in $randomizer" -ForegroundColor Cyan
    }
}

Write-Host "`nDone! Fixed all CSS spacing issues." -ForegroundColor Green
