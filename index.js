const express = require('express');
const app = express();
app.use(express.json());

// Trust Azure's proxy to get the real client IP
app.set('trust proxy', true);

let logs = [];

// POST endpoint to log data
app.post('/log', (req, res) => {
  const clientIp = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress;
  const entry = {
    time: new Date().toISOString(),
    ip: clientIp,
    data: req.body
  };
  logs.push(entry);
  console.log('Received:', entry);
  res.json({ status: 'ok', received: entry });
});

// GET endpoint to show logs in Bootstrap table
app.get('/', (req, res) => {
  const tableRows = logs.map(log => {
    const dataCells = Object.entries(log.data || {})
      .map(([k, v]) => `<strong>${k}</strong>: ${v}`)
      .join('<br>');
    return `
      <tr>
        <td>${log.time}</td>
        <td>${log.ip}</td>
        <td>${dataCells}</td>
      </tr>
    `;
  }).join('');

  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Request Log</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body class="p-4">
      <h1 class="mb-4">Request Log</h1>
      <table class="table table-striped table-bordered">
        <thead class="table-dark">
          <tr>
            <th>Timestamp (UTC)</th>
            <th>Client IP</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows || '<tr><td colspan="3" class="text-center">No entries yet</td></tr>'}
        </tbody>
      </table>
    </body>
    </html>
  `);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on ${port}`));