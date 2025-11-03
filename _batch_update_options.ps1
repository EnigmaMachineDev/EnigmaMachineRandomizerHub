# PowerShell script to update all options pages to collapsible format

$randomizers = @(
    @{Name="ArtworkMediaRandomizer"; StorageKey="artworkMediaOptions"; JsonFile="mediums.json"},
    @{Name="BakingRandomizer"; StorageKey="bakingOptions"; JsonFile="randomizer.json"},
    @{Name="BeerBrewingRandomizer"; StorageKey="beerBrewingOptions"; JsonFile="randomizer.json"},
    @{Name="BrewingRandomizer"; StorageKey="brewingOptions"; JsonFile="randomizer.json"},
    @{Name="CharacterPersonalityRandomizer"; StorageKey="characterPersonalityOptions"; JsonFile="randomizer.json"},
    @{Name="Civ5Randomizer"; StorageKey="civ5Options"; JsonFile="randomizer.json"},
    @{Name="CoffeeRandomizer"; StorageKey="coffeeOptions"; JsonFile="randomizer.json"},
    @{Name="DarkSouls3CharacterRandomizer"; StorageKey="darkSouls3Options"; JsonFile="randomizer.json"},
    @{Name="DistillingRandomizer"; StorageKey="distillingOptions"; JsonFile="randomizer.json"},
    @{Name="EliteDangerousRandomizer"; StorageKey="eliteDangerousOptions"; JsonFile="randomizer.json"},
    @{Name="GrimDawnCharacterRandomizer"; StorageKey="grimDawnOptions"; JsonFile="randomizer.json"},
    @{Name="HomebrewingWineRandomizer"; StorageKey="homebrewingWineOptions"; JsonFile="randomizer.json"},
    @{Name="HotSauceMakingRandomizer"; StorageKey="hotSauceOptions"; JsonFile="randomizer.json"},
    @{Name="LiesOfPRandomizer"; StorageKey="liesOfPOptions"; JsonFile="randomizer.json"},
    @{Name="NoMansSkyRandomizer"; StorageKey="noMansSkyOptions"; JsonFile="randomizer.json"},
    @{Name="PathOfExile2CharacterRandomizer"; StorageKey="pathOfExile2Options"; JsonFile="randomizer.json"},
    @{Name="RealmOfTheMadGodRandomizer"; StorageKey="realmOfTheMadGodOptions"; JsonFile="randomizer.json"},
    @{Name="SkyrimCharacterRandomizer"; StorageKey="skyrimOptions"; JsonFile="randomizer.json"},
    @{Name="SoulframeLoadoutRandomizer"; StorageKey="soulframeOptions"; JsonFile="randomizer.json"},
    @{Name="SpaceMarine2LoadoutRandomizer"; StorageKey="spaceMarine2Options"; JsonFile="randomizer.json"},
    @{Name="TeaRandomizer"; StorageKey="teaOptions"; JsonFile="randomizer.json"},
    @{Name="TravelRandomizer"; StorageKey="travelOptions"; JsonFile="randomizer.json"},
    @{Name="WarframeLoadoutRandomizer"; StorageKey="warframeOptions"; JsonFile="randomizer.json"}
)

$templateHtml = Get-Content "_shared\collapsible-options.html" -Raw
$templateJs = Get-Content "_shared\collapsible-options.js" -Raw

foreach ($rand in $randomizers) {
    $dir = $rand.Name
    $storageKey = $rand.StorageKey
    $jsonFile = $rand.JsonFile
    
    Write-Host "Updating $dir..." -ForegroundColor Cyan
    
    # Update options.html
    $htmlPath = Join-Path $dir "options.html"
    if (Test-Path $htmlPath) {
        # Get the title from existing file if possible
        $existingHtml = Get-Content $htmlPath -Raw
        if ($existingHtml -match '<title>([^<]+)</title>') {
            $title = $matches[1]
        } else {
            $title = "$($rand.Name.Replace('Randomizer','')) Randomizer - Options"
        }
        
        $newHtml = $templateHtml -replace '<title>Randomizer - Options</title>', "<title>$title</title>"
        Set-Content -Path $htmlPath -Value $newHtml -NoNewline
        Write-Host "  Updated options.html" -ForegroundColor Green
    }
    
    # Update options.js
    $jsPath = Join-Path $dir "options.js"
    if (Test-Path $jsPath) {
        $newJs = $templateJs -replace "const STORAGE_KEY = 'randomizerOptions';", "const STORAGE_KEY = '$storageKey';"
        $newJs = $newJs -replace "const JSON_FILE = 'randomizer.json';", "const JSON_FILE = '$jsonFile';"
        Set-Content -Path $jsPath -Value $newJs -NoNewline
        Write-Host "  Updated options.js" -ForegroundColor Green
    }
}

Write-Host "`nAll randomizers updated!" -ForegroundColor Yellow
