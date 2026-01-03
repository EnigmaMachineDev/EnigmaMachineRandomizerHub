# Script to fix the `n character issue in all randomizer files

$randomizers = @(
    "Starcraft1Randomizer",
    "Starcraft2Randomizer",
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
        
        # Remove the literal `n characters
        $content = $content -replace '`n', ''
        
        # Save the file
        Set-Content -Path $indexPath -Value $content -NoNewline
        
        Write-Host "  Fixed $randomizer" -ForegroundColor Cyan
    }
}

Write-Host "`nDone! Fixed all files." -ForegroundColor Green
