const express = require('express');
const app = express();

app.use(express.json({ limit: '1mb' }));
app.set('trust proxy', true);

const requiredFields = ['student_id', 'hacker_handle', 'filename', 'public_ip', 'data'];
let logs = [];

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }

  return req.socket?.remoteAddress || 'unknown';
}

function sanitizeString(value) {
  if (value === undefined || value === null) {
    return '';
  }

  return String(value).trim();
}

app.post('/log', (req, res) => {
  const payload = req.body && typeof req.body === 'object' ? req.body : {};
  const missing = requiredFields.filter((field) => {
    const value = payload[field];
    return value === undefined || value === null || sanitizeString(value) === '';
  });

  if (missing.length > 0) {
    return res.status(400).json({
      status: 'rejected',
      reason: 'Missing required fields',
      missing
    });
  }

  const time = new Date().toISOString();
  const entry = {
    timestamp: time,
    client_ip: getClientIp(req),
    student_id: sanitizeString(payload.student_id),
    hacker_handle: sanitizeString(payload.hacker_handle),
    filename: sanitizeString(payload.filename),
    public_ip: sanitizeString(payload.public_ip),
    data: sanitizeString(payload.data)
  };

  logs.push(entry);
  return res.status(200).json({ status: 'accepted', received: entry });
});

app.get('/', (req, res) => {
  const rows = logs
    .slice()
    .reverse()
    .map((log) => `
      <tr>
        <td>${log.timestamp}</td>
        <td>${log.student_id}</td>
        <td>${log.hacker_handle}</td>
        <td>${log.filename}</td>
        <td>${log.public_ip}</td>
        <td>${log.data}</td>
        <td>${log.client_ip}</td>
      </tr>
    `)
    .join('');

  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Retro Hacker Ops Console</title>
      <style>
        :root {
          --bg: #07130d;
          --panel: #0d1f18;
          --green: #7ef7b8;
          --green-soft: #4fe39d;
          --cyan: #78f4ff;
          --muted: #b7d9c3;
          --border: rgba(126, 247, 184, 0.5);
        }
        body {
          margin: 0;
          background: radial-gradient(circle at top, #0d261d 0%, var(--bg) 45%, #050b08 100%);
          color: var(--green);
          font-family: "Consolas", "Courier New", monospace;
          padding: 32px;
        }
        .console {
          max-width: 1400px;
          margin: 0 auto;
          border: 1px solid var(--border);
          background: rgba(13, 31, 24, 0.9);
          box-shadow: 0 0 25px rgba(126, 247, 184, 0.2);
        }
        .header {
          padding: 18px 22px;
          border-bottom: 1px solid var(--border);
          background: rgba(18, 49, 36, 0.8);
        }
        h1 {
          margin: 0;
          font-size: 1.8rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .status {
          color: var(--cyan);
          margin-top: 8px;
          font-size: 0.9rem;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          border: 1px solid var(--border);
          padding: 10px 12px;
          text-align: left;
          vertical-align: top;
        }
        th {
          background: rgba(27, 63, 48, 0.9);
          color: var(--cyan);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        td {
          color: var(--muted);
          word-break: break-word;
        }
        .empty {
          text-align: center;
          padding: 24px;
          color: var(--muted);
        }
      </style>
    </head>
    <body>
      <div class="console">
        <div class="header">
          <h1>Retro Hacker Ops Console</h1>
          <div class="status">// student telemetry / live capture / authorized payloads only</div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Student ID</th>
              <th>Hacker Handle</th>
              <th>Filename</th>
              <th>Public IP</th>
              <th>Data</th>
              <th>Source IP</th>
            </tr>
          </thead>
          <tbody>
            ${rows || '<tr><td colspan="7" class="empty">No payloads logged yet. Awaiting student submissions...</td></tr>'}
          </tbody>
        </table>
      </div>
    </body>
    </html>
  `);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Retro Hacker listener running on port ${port}`));