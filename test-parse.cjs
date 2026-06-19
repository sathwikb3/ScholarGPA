async function test() {
  try {
    const req = await fetch('http://localhost:3000/api/parse-grades-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'test', base64Image: Buffer.from('test').toString('base64'), mimeType: 'image/jpeg' })
    });
    console.log(await req.json());
  } catch (err) {
    console.error(err);
  }
}
test();
