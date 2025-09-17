const express = require('express');
const app = express();
app.use(express.json());

let logs = [];

app.post('/log', (req, res) => {
  const entry = { time: new Date(), body: req.body };
  logs.push(entry);
  console.log('Received:', entry);
  res.json({ status: 'ok', received: entry });
});

app.get('/', (req, res) => {
  res.send(`<h1>Request Log</h1><pre>${JSON.stringify(logs, null, 2)}</pre>`);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on ${port}`));