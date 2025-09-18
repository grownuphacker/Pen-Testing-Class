const express = require('express');
const app = express();
app.use(express.json());

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
  res.json({ status: 'ok', received: entry });
});

// GET endpoint to show logs in Bootstrap table
app.get('/', (req, res) => {
  res.send(`<h1>Request Log</h1><pre>${JSON.stringify(logs, null, 2)}</pre>`);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on ${port}`));
