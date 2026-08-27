$port = 8000

# Check if server is already running on port 8000
$portOccupied = $false
try {
    $testConnection = New-Object System.Net.Sockets.TcpClient("127.0.0.1", 8000)
    $testConnection.Close()
    $portOccupied = $true
} catch {
    # Port is free
}

if ($portOccupied) {
    Write-Host "---------------------------------------------------------------------"
    Write-Host "Server is already running on port 8000! Opening browser..." -ForegroundColor Green
    Write-Host "---------------------------------------------------------------------"
    Start-Process "http://localhost:8000/"
    Start-Sleep -Seconds 2
    exit
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://127.0.0.1:8000/")
$listener.Prefixes.Add("http://localhost:8000/")

# Get local IPv4 address
$localIP = (Get-NetIPAddress | Where-Object { $_.AddressFamily -eq 'IPv4' -and $_.IPAddress -notlike '127.*' -and $_.IPAddress -notlike '169.254.*' } | Select-Object -First 1).IPAddress

$mobileUrl = ""
$mobilePrefixAdded = $false
if ($localIP) {
    try {
        $listener.Prefixes.Add("http://" + $localIP + ":8000/")
        $mobileUrl = "http://" + $localIP + ":8000/"
        $mobilePrefixAdded = $true
    } catch {
        $mobileUrl = "http://" + $localIP + ":8000/ (Requires Administrator privileges)"
    }
} else {
    $mobileUrl = "No local Wi-Fi IP address found."
}

Write-Host "====================================================================="
Write-Host "  Samdech Ouv School Staff Management - Local Server"
Write-Host "====================================================================="
Write-Host " -> PC URL: http://localhost:8000/"
Write-Host " -> Mobile URL (Same Wi-Fi): $mobileUrl"
Write-Host "====================================================================="
Write-Host "To stop the server, simply close this console window."
Write-Host "---------------------------------------------------------------------"

try {
    $listener.Start()
} catch {
    # If starting fails (likely due to access denied on local IP), re-create a fresh listener for loopback only
    if ($mobilePrefixAdded) {
        Write-Host "Access denied for external IP binding. Retrying with localhost/127.0.0.1 only..."
        $listener = New-Object System.Net.HttpListener
        $listener.Prefixes.Add("http://127.0.0.1:8000/")
        $listener.Prefixes.Add("http://localhost:8000/")
        try {
            $listener.Start()
            Write-Host "Localhost server started successfully."
        } catch {
            Write-Error "Failed to start server: $_"
            exit
        }
    } else {
        Write-Error "Failed to start server: $_"
        exit
    }
}

try {
    # Auto-open browser on local machine
    Start-Process "http://localhost:8000/"
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $urlPath = $request.Url.LocalPath
        if ($urlPath -eq "/") { $urlPath = "/index.html" }
        
        $cleanPath = $urlPath.TrimStart('/')
        $filePath = [System.IO.Path]::Combine((Get-Location).Path, $cleanPath)
        
        if (Test-Path $filePath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = "text/plain"
            if ($ext -eq ".html" -or $ext -eq ".htm") { $contentType = "text/html; charset=utf-8" }
            elseif ($ext -eq ".css") { $contentType = "text/css" }
            elseif ($ext -eq ".js") { $contentType = "application/javascript" }
            elseif ($ext -eq ".jpg" -or $ext -eq ".jpeg") { $contentType = "image/jpeg" }
            elseif ($ext -eq ".png") { $contentType = "image/png" }
            elseif ($ext -eq ".json") { $contentType = "application/json" }
            
            $response.ContentType = $contentType
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
        }
        $response.Close()
    }
} catch {
    Write-Error $_
} finally {
    $listener.Close()
}
