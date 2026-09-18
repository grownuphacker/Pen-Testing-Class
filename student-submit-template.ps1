## Replace this with the student lab URL you were assigned.
$serviceUrl = "https://<your-student-lab>.azurewebsites.net/log"

# Required payload keys for the retro hacker logger.
# student_id
# hacker_handle
# filename
# public_ip
# data

$publicIp = (Invoke-RestMethod -Uri "https://api.ipify.org" -UseBasicParsing).Trim()

$studentId = Read-Host "Enter student ID"
$hackerHandle = Read-Host "Enter hacker handle"
$filename = Read-Host "Enter artifact filename"
$dataValue = Read-Host "Enter the PowerShell glob or data string to submit"

$payload = @{
    student_id = $studentId
    hacker_handle = $hackerHandle
    filename = $filename
    public_ip = $publicIp
    data = $dataValue
}

$response = Invoke-RestMethod -Uri $serviceUrl -Method POST -Body ($payload | ConvertTo-Json -Compress) -ContentType "application/json"

$response
