const fs = require('fs');
async function test() {
  try {
    const req = await fetch('http://localhost:3000/api/parse-grades-text', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'test' })
    });
    console.log(await req.json());
  } catch (err) {
    console.error(err);
  }
}
test();
