param (
    [Parameter(ValueFromPipeline = $true)]
    [string]$input
)

BEGIN {
    $inputLines = @()
}

PROCESS {
    $inputLines += $input
}

END {
    $id = $inputLines[0]
    $dropsFromIndex = $inputLines.IndexOf("Drops From")
    $useInIndex = $inputLines.IndexOf("Useable in")

    $difference = $useInIndex - $dropsFromIndex
    if ($difference -gt 2){
        $dropsFrom = $inputLines[$dropsFromIndex + 1]
        $dropsFrom += $inputLines[$dropsFromIndex + 2]
        $dropsFrom = $dropsFrom.Substring(1, $dropsFrom.Length - 2)
    } else {
        $dropsFrom += $inputLines[$useInIndex - 1]
    }
    $useIn = $inputLines[$useInIndex + 1]

    $drops = @()
    for ($i = 1; $i -lt $dropsFromIndex; $i++) {
        if ($inputLines[$i] -match "(\d+)%\s+(.+)") {
            $chance = [math]::Round($matches[1] / 100, 2)
            $name = $matches[2]
            $drops += [PSCustomObject]@{
                chance = $chance
                name = $name
            }
        }
    }

    # Manually construct JSON string to ensure order
    $jsonDrops = ($drops | ConvertTo-Json -Depth 3 -Compress)
    $jsonOutput = @"
"$id": {
    "drops": $jsonDrops,
    "dropsFrom": "$dropsFrom",
    "useIn": "$useIn"
}
"@

    # Copy the JSON output to the clipboard
    $jsonOutput | Set-Clipboard
}