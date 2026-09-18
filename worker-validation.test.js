const http = require('http');
const path = require('path');
const { spawn } = require('child_process');

function request(pathname, payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const req = http.request({
      hostname: '127.0.0.1',
      port: 8787,
      path: pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, body }));
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function main() {
  const wranglerBin = path.join(__dirname, 'node_modules', '.bin', process.platform === 'win32' ? 'wrangler.cmd' : 'wrangler');
  const server = spawn('cmd.exe', ['/c', `${wranglerBin} dev --local --port 8787`], {
    cwd: __dirname,
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: false
  });

  await new Promise(resolve => setTimeout(resolve, 5000));

  try {
    const invalid = await request('/', { student_id: '42' });
    const valid = await request('/', {
      student_id: '10350959',
      hacker_handle: 'neo',
      filename: 'notes.txt',
      public_ip: '10.10.10.10',
      data: 'C:\\Temp\\*.txt'
    });

    const privateIp = await request('/', {
      student_id: '10362120',
      hacker_handle: 'ghost',
      filename: 'private.txt',
      public_ip: '10.0.0.5',
      data: 'do-not-store-this'
    });

    const results = {
      invalidStatus: invalid.statusCode,
      validStatus: valid.statusCode,
      privateStatus: privateIp.statusCode,
      invalidBody: invalid.body,
      validBody: valid.body,
      privateBody: privateIp.body
    };

    console.log(JSON.stringify(results, null, 2));

    if (invalid.statusCode !== 400) {
      throw new Error(`Expected invalid payload to be rejected with 400, got ${invalid.statusCode}`);
    }

    if (valid.statusCode !== 200) {
      throw new Error(`Expected valid payload to be accepted with 200, got ${valid.statusCode}`);
    }

    if (privateIp.statusCode !== 200) {
      throw new Error(`Expected private IP payload to be accepted with 200, got ${privateIp.statusCode}`);
    }

    if (!valid.body.includes('🚨I DIDN\'T READ THE INSTRUCTIONS') || !valid.body.includes('Love, J.R.')) {
      throw new Error('Warning payload for sample public IP was not transformed to the required message');
    }

    if (!privateIp.body.includes('🚨I\'VE FORGOTTEN NETWORK BASICS') || !privateIp.body.includes('Love, G.B.')) {
      throw new Error('Warning payload for private IP was not transformed to the required message');
    }

    const dashboard = await new Promise((resolve, reject) => {
      const req = http.get('http://127.0.0.1:8787/dashboard', (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => resolve({ statusCode: res.statusCode, body }));
      });
      req.on('error', reject);
    });

    if (dashboard.statusCode !== 200 || !dashboard.body.includes('The No Grip Elite Hackery Society')) {
      throw new Error('Dashboard page did not render expected branding');
    }

    const statusPage = await new Promise((resolve, reject) => {
      const req = http.get('http://127.0.0.1:8787/status', (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => resolve({ statusCode: res.statusCode, body }));
      });
      req.on('error', reject);
    });

    if (statusPage.statusCode !== 200 || !statusPage.body.includes('10350959') || !statusPage.body.includes('10362120')) {
      throw new Error('Status page did not reflect persisted student submissions');
    }

    console.log('Validation test passed.');
    process.exit(0);
  } finally {
    server.kill('SIGTERM');
  }
}

main().catch((error) => {
  console.error(error.stack || String(error));
  process.exit(1);
});
