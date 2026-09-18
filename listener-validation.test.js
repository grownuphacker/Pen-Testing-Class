const { spawn } = require('child_process');
const http = require('http');

function request(pathname, payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const req = http.request({
      hostname: '127.0.0.1',
      port: 3456,
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
  const server = spawn(process.execPath, ['index.js'], {
    cwd: __dirname,
    env: { ...process.env, PORT: '3456' },
    stdio: ['ignore', 'pipe', 'pipe']
  });

  let output = '';
  server.stdout.on('data', chunk => output += chunk.toString());
  server.stderr.on('data', chunk => output += chunk.toString());

  await new Promise(resolve => setTimeout(resolve, 1000));

  try {
    const invalid = await request('/log', { student_id: '42' });
    const valid = await request('/log', {
      student_id: '42',
      hacker_handle: 'neo',
      filename: 'notes.txt',
      public_ip: '203.0.113.15',
      data: 'C:\\Temp\\*.txt'
    });

    const results = {
      invalidStatus: invalid.statusCode,
      validStatus: valid.statusCode,
      invalidBody: invalid.body,
      validBody: valid.body
    };

    console.log(JSON.stringify(results, null, 2));

    if (invalid.statusCode !== 400) {
      throw new Error(`Expected invalid payload to be rejected with 400, got ${invalid.statusCode}`);
    }

    if (valid.statusCode !== 200) {
      throw new Error(`Expected valid payload to be accepted with 200, got ${valid.statusCode}`);
    }

    console.log('Validation test passed.');
  } finally {
    server.kill('SIGTERM');
  }
}

main().catch((error) => {
  console.error(error.stack || String(error));
  process.exit(1);
});
