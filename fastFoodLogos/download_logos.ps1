# Fast Food Logo Downloader
# Downloads official/press logos from each restaurant's brand assets page
# Run this script from the fastFoodLogos directory
# Some logos may require manual download due to login walls or copyright restrictions

$logos = @(
    @{ Name = "McDonalds";      Url = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/McDonald%27s_Golden_Arches.svg/1200px-McDonald%27s_Golden_Arches.svg.png"; File = "mcdonalds.png" },
    @{ Name = "Starbucks";      Url = "https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Starbucks_Corporation_Logo_2011.svg/1200px-Starbucks_Corporation_Logo_2011.svg.png"; File = "starbucks.png" },
    @{ Name = "Subway";         Url = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Subway_2016_logo.svg/1200px-Subway_2016_logo.svg.png"; File = "subway.png" },
    @{ Name = "ChickFilA";      Url = "https://upload.wikimedia.org/wikipedia/en/thumb/0/02/Chick-fil-A_Logo.svg/800px-Chick-fil-A_Logo.svg.png"; File = "chickfila.png" },
    @{ Name = "TacoBell";       Url = "https://upload.wikimedia.org/wikipedia/en/thumb/b/b4/Tacobell_current_logo.svg/600px-Tacobell_current_logo.svg.png"; File = "tacobell.png" },
    @{ Name = "Wendys";         Url = "https://upload.wikimedia.org/wikipedia/en/thumb/a/a2/Wendy%27s_full_logo_2012.svg/600px-Wendy%27s_full_logo_2012.svg.png"; File = "wendys.png" },
    @{ Name = "BurgerKing";     Url = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Burger_King_logo_%281999%29.svg/600px-Burger_King_logo_%281999%29.svg.png"; File = "burgerking.png" },
    @{ Name = "Dunkin";         Url = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Dunkin%27_Donuts_logo.svg/600px-Dunkin%27_Donuts_logo.svg.png"; File = "dunkin.png" },
    @{ Name = "Chipotle";       Url = "https://upload.wikimedia.org/wikipedia/en/thumb/3/3b/Chipotle_Mexican_Grill_logo.svg/1200px-Chipotle_Mexican_Grill_logo.svg.png"; File = "chipotle.png" },
    @{ Name = "Sonic";          Url = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Sonic_Drive-In_logo.svg/600px-Sonic_Drive-In_logo.svg.png"; File = "sonic.png" },
    @{ Name = "KFC";            Url = "https://upload.wikimedia.org/wikipedia/en/thumb/b/bf/KFC_logo.svg/600px-KFC_logo.svg.png"; File = "kfc.png" },
    @{ Name = "Dominos";        Url = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Domino%27s_pizza_logo.svg/1200px-Domino%27s_pizza_logo.svg.png"; File = "dominos.png" },
    @{ Name = "PizzaHut";       Url = "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Pizza_Hut_logo.svg/600px-Pizza_Hut_logo.svg.png"; File = "pizzahut.png" },
    @{ Name = "PaneraBread";    Url = "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Panera_Bread_wordmark.svg/600px-Panera_Bread_wordmark.svg.png"; File = "panerabread.png" },
    @{ Name = "Popeyes";        Url = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Popeyes_logo.svg/600px-Popeyes_logo.svg.png"; File = "popeyes.png" },
    @{ Name = "Arbys";          Url = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Arby%27s_logo.svg/600px-Arby%27s_logo.svg.png"; File = "arbys.png" },
    @{ Name = "JackInTheBox";   Url = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Jack_in_the_Box_logo.svg/600px-Jack_in_the_Box_logo.svg.png"; File = "jackinthebox.png" },
    @{ Name = "JimmyJohns";     Url = "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Jimmy_John%27s_logo.svg/600px-Jimmy_John%27s_logo.svg.png"; File = "jimmyjohns.png" },
    @{ Name = "DairyQueen";     Url = "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Dairy_Queen_logo.svg/600px-Dairy_Queen_logo.svg.png"; File = "dairyqueen.png" },
    @{ Name = "LittleCaesars";  Url = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Little_Caesars_logo.svg/600px-Little_Caesars_logo.svg.png"; File = "littlecaesars.png" },
    @{ Name = "FiveGuys";       Url = "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Five_Guys_logo.svg/600px-Five_Guys_logo.svg.png"; File = "fiveguys.png" },
    @{ Name = "PandaExpress";   Url = "https://upload.wikimedia.org/wikipedia/en/thumb/e/e3/Panda_Express_logo.svg/600px-Panda_Express_logo.svg.png"; File = "pandaexpress.png" },
    @{ Name = "PapaJohns";      Url = "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Papa_John%27s_logo.svg/600px-Papa_John%27s_logo.svg.png"; File = "papajohns.png" },
    @{ Name = "HardeesCarlsJr"; Url = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Carl%27s_Jr._logo.svg/600px-Carl%27s_Jr._logo.svg.png"; File = "hardees_carlsjr.png" },
    @{ Name = "Whataburger";    Url = "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Whataburger_full_color_stacked_logo.svg/600px-Whataburger_full_color_stacked_logo.svg.png"; File = "whataburger.png" },
    @{ Name = "InNOut";         Url = "https://upload.wikimedia.org/wikipedia/en/thumb/0/04/In-N-Out_Burger_logo.svg/600px-In-N-Out_Burger_logo.svg.png"; File = "innout.png" },
    @{ Name = "Culvers";        Url = "https://upload.wikimedia.org/wikipedia/en/thumb/9/93/Culver%27s_logo.svg/600px-Culver%27s_logo.svg.png"; File = "culvers.png" },
    @{ Name = "Zaxbys";         Url = "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Zaxby%27s_logo.svg/600px-Zaxby%27s_logo.svg.png"; File = "zaxbys.png" },
    @{ Name = "RaisingCanes";   Url = "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Raising_Cane%27s_Chicken_Fingers_logo.svg/600px-Raising_Cane%27s_Chicken_Fingers_logo.svg.png"; File = "raisingcanes.png" },
    @{ Name = "Wingstop";       Url = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Wingstop_logo.svg/600px-Wingstop_logo.svg.png"; File = "wingstop.png" },
    @{ Name = "JerseyMikes";    Url = "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Jersey_Mike%27s_Subs_logo.svg/600px-Jersey_Mike%27s_Subs_logo.svg.png"; File = "jerseymikes.png" },
    @{ Name = "FirehouseSubs";  Url = "https://upload.wikimedia.org/wikipedia/en/thumb/e/e7/Firehouse_Subs_logo.svg/600px-Firehouse_Subs_logo.svg.png"; File = "firehousesubs.png" },
    @{ Name = "Bojangles";      Url = "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Bojangles_logo.svg/600px-Bojangles_logo.svg.png"; File = "bojangles.png" },
    @{ Name = "DelTaco";        Url = "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Del_Taco_logo.svg/600px-Del_Taco_logo.svg.png"; File = "deltaco.png" },
    @{ Name = "WhiteCastle";    Url = "https://upload.wikimedia.org/wikipedia/en/thumb/1/1d/White_Castle_logo.svg/600px-White_Castle_logo.svg.png"; File = "whitecastle.png" }
)

$scriptDir = if ($PSScriptRoot) { $PSScriptRoot } else { Split-Path -Parent $MyInvocation.MyCommand.Path }
if (-not $scriptDir) { $scriptDir = (Get-Location).Path }
$successCount = 0
$failCount = 0
$failedList = @()
$delayMs = 2000
$maxRetries = 3

function Get-LogoFile($logo, $scriptDir) {
    $outputPath = Join-Path $scriptDir $logo.File
    for ($attempt = 1; $attempt -le $maxRetries; $attempt++) {
        try {
            $webClient = New-Object System.Net.WebClient
            $webClient.Headers.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
            $webClient.Headers.Add("Accept", "image/webp,image/apng,image/*,*/*;q=0.8")
            $webClient.Headers.Add("Accept-Language", "en-US,en;q=0.9")
            $webClient.DownloadFile($logo.Url, $outputPath)

            if (Test-Path $outputPath) {
                $size = (Get-Item $outputPath).Length
                if ($size -gt 1000) {
                    return @{ Success = $true; Size = $size }
                } else {
                    Remove-Item $outputPath -Force
                    return @{ Success = $false; Error = "file too small" }
                }
            }
            return @{ Success = $false; Error = "file not created" }
        } catch {
            $errMsg = $_.ToString()
            if ($errMsg -match "429" -and $attempt -lt $maxRetries) {
                $waitSec = $attempt * 5
                Write-Host " (429 rate limited, waiting ${waitSec}s, retry $attempt/$maxRetries)" -ForegroundColor Yellow -NoNewline
                Start-Sleep -Seconds $waitSec
            } else {
                return @{ Success = $false; Error = $errMsg }
            }
        }
    }
    return @{ Success = $false; Error = "max retries exceeded" }
}

Write-Host "=== Fast Food Logo Downloader ===" -ForegroundColor Cyan
Write-Host "Downloading $($logos.Count) logos to: $scriptDir" -ForegroundColor Cyan
Write-Host "(Using ${delayMs}ms delay between requests + retry on 429)" -ForegroundColor DarkCyan
Write-Host ""

foreach ($logo in $logos) {
    $outputPath = Join-Path $scriptDir $logo.File
    if (Test-Path $outputPath) {
        $size = (Get-Item $outputPath).Length
        if ($size -gt 1000) {
            Write-Host "Skipping $($logo.Name) (already exists, $([math]::Round($size/1KB, 1)) KB)" -ForegroundColor DarkGreen
            $successCount++
            continue
        }
    }

    Write-Host "Downloading $($logo.Name)..." -NoNewline
    $result = Get-LogoFile $logo $scriptDir
    if ($result.Success) {
        Write-Host " OK ($([math]::Round($result.Size/1KB, 1)) KB)" -ForegroundColor Green
        $successCount++
    } else {
        Write-Host " FAILED ($($result.Error))" -ForegroundColor Red
        $failCount++
        $failedList += $logo.Name
    }
    Start-Sleep -Milliseconds $delayMs
}

Write-Host ""
Write-Host "=== Results ===" -ForegroundColor Cyan
Write-Host "Success: $successCount" -ForegroundColor Green
Write-Host "Failed:  $failCount" -ForegroundColor $(if ($failCount -gt 0) { "Red" } else { "Green" })

if ($failedList.Count -gt 0) {
    Write-Host ""
    Write-Host "The following logos need to be downloaded manually:" -ForegroundColor Yellow
    foreach ($name in $failedList) {
        Write-Host "  - $name" -ForegroundColor Yellow
    }
    Write-Host ""
    Write-Host "For manual downloads, visit the official brand/press pages:" -ForegroundColor Yellow
    Write-Host "  McDonald's:     https://corporate.mcdonalds.com/corpmcd/en-us/our-stories/media-library.html" -ForegroundColor Gray
    Write-Host "  Starbucks:      https://stories.starbucks.com/press/media-assets/" -ForegroundColor Gray
    Write-Host "  Subway:         https://www.subway.com/en-US/ExploreOurWorld/PressRoom" -ForegroundColor Gray
    Write-Host "  Chick-fil-A:    https://www.chick-fil-a.com/media" -ForegroundColor Gray
    Write-Host "  Taco Bell:      https://www.tacobell.com/newsroom" -ForegroundColor Gray
    Write-Host "  Wendy's:        https://www.wendys.com/brand-newsroom" -ForegroundColor Gray
    Write-Host "  Burger King:    https://www.bk.com/newsroom" -ForegroundColor Gray
    Write-Host "  Dunkin':        https://news.dunkindonuts.com/" -ForegroundColor Gray
    Write-Host "  KFC:            https://www.kfc.com/about/pressroom" -ForegroundColor Gray
    Write-Host "  Domino's:       https://ir.dominos.com/news-releases" -ForegroundColor Gray
    Write-Host "  Pizza Hut:      https://pizzahut.com/news" -ForegroundColor Gray
    Write-Host "  Panera Bread:   https://www.panerabread.com/en-us/articles/media.html" -ForegroundColor Gray
    Write-Host "  Popeyes:        https://www.popeyes.com/news" -ForegroundColor Gray
    Write-Host "  Arby's:         https://arbys.com/news" -ForegroundColor Gray
    Write-Host "  Jack in the Box: https://www.jackinthebox.com/news" -ForegroundColor Gray
    Write-Host "  Jimmy John's:   https://www.jimmyjohns.com/about-us/press/" -ForegroundColor Gray
    Write-Host "  Dairy Queen:    https://www.dairyqueen.com/en-us/company/newsroom/" -ForegroundColor Gray
    Write-Host "  Little Caesars: https://littlecaesars.com/en-us/about-us/press-room/" -ForegroundColor Gray
    Write-Host "  Five Guys:      https://www.fiveguys.com/fans/news" -ForegroundColor Gray
    Write-Host "  Panda Express:  https://www.pandarg.com/News" -ForegroundColor Gray
    Write-Host "  Papa John's:    https://ir.papajohns.com/news-releases" -ForegroundColor Gray
    Write-Host "  Hardee's:       https://www.hardees.com/newsroom" -ForegroundColor Gray
    Write-Host "  Carl's Jr.:     https://www.carlsjr.com/newsroom" -ForegroundColor Gray
    Write-Host "  Whataburger:    https://whataburger.com/company/newsroom" -ForegroundColor Gray
    Write-Host "  In-N-Out:       https://www.in-n-out.com/about/media" -ForegroundColor Gray
    Write-Host "  Culver's:       https://www.culvers.com/newsroom" -ForegroundColor Gray
    Write-Host "  Zaxby's:        https://zaxbys.com/newsroom/" -ForegroundColor Gray
    Write-Host "  Raising Cane's: https://www.raisingcanes.com/news" -ForegroundColor Gray
    Write-Host "  Wingstop:       https://ir.wingstop.com/news-releases" -ForegroundColor Gray
    Write-Host "  Jersey Mike's:  https://www.jerseymikes.com/about/press" -ForegroundColor Gray
    Write-Host "  Firehouse Subs: https://www.firehousesubs.com/about-us/newsroom/" -ForegroundColor Gray
    Write-Host "  Bojangles:      https://www.bojangles.com/media/" -ForegroundColor Gray
    Write-Host "  Del Taco:       https://www.deltaco.com/newsroom" -ForegroundColor Gray
    Write-Host "  White Castle:   https://www.whitecastle.com/about/newsroom" -ForegroundColor Gray
    Write-Host "  Sonic:          https://www.sonicdrivein.com/about/newsroom" -ForegroundColor Gray
}

Write-Host ""
Write-Host "Done! Place any manually downloaded logos in: $scriptDir" -ForegroundColor Cyan
