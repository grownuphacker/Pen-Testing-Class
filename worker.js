const REQUIRED_FIELDS = ['student_id', 'hacker_handle', 'filename', 'public_ip', 'data'];
const BASE_URL = 'https://n.0g.rip';
const LOG_STORE = [];
const VALID_STUDENT_IDS = {
  '10360396': 'M.I.',
  '10197158': 'A.A.',
  '10362120': 'G.B.',
  '10228276': 'S.C.',
  '10075000': 'J.E.',
  '10349324': 'D.F.',
  '10333596': 'E.G.',
  '10362827': 'Z.G.',
  '10133513': 'D.H.',
  '10226099': 'T.J.',
  '10355207': 'O.M.',
  '10350959': 'J.R.',
  '10360912': 'A.S.',
  '10133767': 'A.S.',
  '10330868': 'M.S.',
  '10360907': 'D.T.',
  '10311564': 'M.T.',
  '10291276': 'M.V.',
  '10356747': 'N.V.',
  '10351444': 'N.W.',
  '10345233': 'A.W.'
};

const LANDING_HTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>The No Grip Elite Hackery Society</title>
  <style>
    :root {
      --bg: #050b08;
      --panel: #0d1f18;
      --green: #93ffb6;
      --cyan: #7af5ff;
      --muted: #c9e8d3;
      --border: rgba(147, 255, 182, 0.45);
      --glow: rgba(122, 245, 255, 0.18);
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: "Consolas", "Courier New", monospace;
      background: radial-gradient(circle at top, #10251a 0%, var(--bg) 40%, #030806 100%);
      color: var(--green);
      padding: 36px 20px 60px;
    }
    .wrap {
      max-width: 1100px;
      margin: 0 auto;
      border: 1px solid var(--border);
      box-shadow: 0 0 28px var(--glow);
      background: rgba(13, 31, 24, 0.92);
    }
    .header {
      padding: 24px 28px;
      border-bottom: 1px solid var(--border);
      background: rgba(20, 42, 32, 0.85);
    }
    h1 {
      margin: 0 0 8px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      font-size: clamp(1.6rem, 3vw, 2.8rem);
    }
    .tag {
      color: var(--cyan);
      letter-spacing: 0.12em;
      text-transform: uppercase;
      font-size: 0.8rem;
    }
    .content {
      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
      gap: 20px;
      padding: 24px;
    }
    .panel {
      border: 1px solid var(--border);
      background: rgba(11, 24, 19, 0.88);
      padding: 20px;
    }
    h2 {
      margin-top: 0;
      color: var(--cyan);
      letter-spacing: 0.08em;
      text-transform: uppercase;
      font-size: 1rem;
    }
    .url {
      display: block;
      margin: 8px 0 16px;
      color: var(--green);
      font-weight: bold;
      word-break: break-all;
    }
    pre {
      margin: 0;
      background: rgba(5, 11, 8, 0.9);
      border: 1px solid var(--border);
      padding: 14px;
      color: var(--muted);
      overflow-x: auto;
    }
    ul {
      margin: 0;
      padding-left: 18px;
      line-height: 1.7;
    }
    a {
      color: var(--cyan);
    }
    @media (max-width: 800px) {
      .content { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="header">
      <h1>The No Grip Elite Hackery Society</h1>
      <div class="tag">Signal intake / artifact relay / student submission portal</div>
    </div>
    <div class="content">
      <div class="panel">
        <h2>Mission briefing</h2>
        <p>Use the root domain for all student submissions. The Society is collecting approved payload metadata and file references in a single intake stream.</p>
        <div>
          <strong>Landing page:</strong>
          <span class="url">${BASE_URL}/</span>
        </div>
        <div>
          <strong>Student POST endpoint:</strong>
          <span class="url">${BASE_URL}/</span>
        </div>
        <div>
          <strong>Dashboard:</strong>
          <span class="url">${BASE_URL}/dashboard</span>
        </div>
        <p>Required fields: <strong>student_id</strong>, <strong>hacker_handle</strong>, <strong>filename</strong>, <strong>public_ip</strong>, <strong>data</strong>.</p>
      </div>
      <div class="panel">
        <h2>Payload template</h2>
        <pre>{
  "student_id": "STU-001",
  "hacker_handle": "neo",
  "filename": "loot.txt",
  "public_ip": "203.0.113.15",
  "data": "C:\\Users\\student\\Documents\\*.txt"
}</pre>
      </div>
    </div>
  </div>
</body>
</html>`;

const DASHBOARD_HTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>The No Grip Elite Hackery Society | Dashboard</title>
  <style>
    :root {
      --bg: #050b08;
      --panel: #0d1f18;
      --green: #93ffb6;
      --cyan: #7af5ff;
      --muted: #c9e8d3;
      --border: rgba(147, 255, 182, 0.45);
      --glow: rgba(122, 245, 255, 0.18);
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: "Consolas", "Courier New", monospace;
      background: radial-gradient(circle at top, #10251a 0%, var(--bg) 35%, #030806 100%);
      color: var(--green);
      padding: 32px 18px 60px;
    }
    .wrap {
      max-width: 1400px;
      margin: 0 auto;
      border: 1px solid var(--border);
      box-shadow: 0 0 30px var(--glow);
      background: rgba(13, 31, 24, 0.92);
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      padding: 20px 24px;
      border-bottom: 1px solid var(--border);
      background: rgba(20, 42, 32, 0.85);
    }
    h1 {
      margin: 0;
      font-size: clamp(1.4rem, 2.2vw, 2.2rem);
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .badge {
      color: var(--cyan);
      opacity: 0.9;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-size: 0.8rem;
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
      background: rgba(23, 60, 45, 0.9);
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
      padding: 26px;
      color: var(--muted);
    }
    .nav {
      padding: 12px 24px;
      border-bottom: 1px solid var(--border);
    }
    .nav a {
      color: var(--cyan);
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="header">
      <h1>The No Grip Elite Hackery Society</h1>
      <div class="badge">Dashboard</div>
    </div>
    <div class="nav"><a href="/">Return to intake</a></div>
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
        {{ROWS}}
      </tbody>
    </table>
  </div>
</body>
</html>`;

function sanitize(value) {
  if (value === undefined || value === null) {
    return '';
  }
  return String(value).trim();
}

function isPrivateIp(ip) {
  if (!ip) return false;
  const normalized = String(ip).trim();
  const parts = normalized.split('.');
  if (parts.length !== 4 || parts.some(part => !/^\d+$/.test(part))) {
    return false;
  }

  const octets = parts.map(Number);
  return (
    (octets[0] === 10) ||
    (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31) ||
    (octets[0] === 192 && octets[1] === 168)
  );
}

function buildWarningMessage(publicIp, initials) {
  const cleanInitials = sanitize(initials) || 'N/A';
  if (publicIp === '10.10.10.10') {
    return `🚨I DIDN'T READ THE INSTRUCTIONS\nLove, ${cleanInitials}`;
  }

  if (isPrivateIp(publicIp)) {
    return `🚨I'VE FORGOTTEN NETWORK BASICS\nLove, ${cleanInitials}`;
  }

  return `Love, ${cleanInitials}`;
}

function makeRow(entry) {
  const dataHtml = (entry.data || '')
    .replace(/\n/g, '<br>')
    .replace(/🚨/g, '<span style="color:#ff5a5a; font-size:1.8em; font-weight:bold;">🚨</span>');

  return `
    <tr>
      <td>${entry.timestamp}</td>
      <td>${entry.student_id}</td>
      <td>${entry.hacker_handle}</td>
      <td>${entry.filename}</td>
      <td>${entry.public_ip}</td>
      <td><div style="white-space: pre-line; line-height:1.6;">${dataHtml}</div></td>
      <td>${entry.client_ip}</td>
    </tr>
  `;
}

function loadEntries() {
  return LOG_STORE.slice(-250);
}

function saveEntries(entries) {
  LOG_STORE.length = 0;
  LOG_STORE.push(...entries.slice(-250));
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const method = request.method.toUpperCase();

    if (method === 'GET' && url.pathname === '/') {
      return new Response(LANDING_HTML, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    }

    if (method === 'GET' && url.pathname === '/dashboard') {
      const entries = loadEntries();
      const rows = entries.slice().reverse().map(makeRow).join('') || '<tr><td colspan="7" class="empty">No payloads logged yet. Awaiting student submissions...</td></tr>';
      return new Response(DASHBOARD_HTML.replace('{{ROWS}}', rows), { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    }

    if (method === 'POST' && url.pathname === '/') {
      try {
        const payload = await request.json();
        const missing = REQUIRED_FIELDS.filter((field) => {
          const value = payload?.[field];
          return value === undefined || value === null || sanitize(value) === '';
        });

        if (missing.length > 0) {
          return Response.json({
            status: 'rejected',
            reason: 'Missing required fields',
            missing
          }, { status: 400 });
        }

        const rawStudentId = sanitize(payload.student_id);
        const validStudentId = /^\d{8}$/.test(rawStudentId) && Object.prototype.hasOwnProperty.call(VALID_STUDENT_IDS, rawStudentId);

        if (!validStudentId) {
          return Response.json({
            status: 'rejected',
            reason: 'Invalid student_id',
            validStudents: Object.keys(VALID_STUDENT_IDS)
          }, { status: 400 });
        }

        const clientIp = request.headers.get('cf-connecting-ip') || 'unknown';
        const publicIp = sanitize(payload.public_ip);
        const initials = VALID_STUDENT_IDS[rawStudentId];
        const entry = {
          timestamp: new Date().toISOString(),
          client_ip: clientIp,
          student_id: rawStudentId,
          hacker_handle: sanitize(payload.hacker_handle),
          filename: sanitize(payload.filename),
          public_ip: publicIp,
          data: buildWarningMessage(publicIp, initials)
        };

        const entries = loadEntries();
        entries.push(entry);
        saveEntries(entries);

        return Response.json({ status: 'accepted', received: entry }, { status: 200 });
      } catch (error) {
        return Response.json({
          status: 'rejected',
          reason: 'Invalid JSON payload'
        }, { status: 400 });
      }
    }

    return new Response('Not found', { status: 404 });
  }
};
