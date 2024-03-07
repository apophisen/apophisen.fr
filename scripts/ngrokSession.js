import { forward, kill } from '@ngrok/ngrok';
import { createInterface } from 'readline';

async function ngrokSession() {
  const url = await forward({
    addr: 3000,
    authtoken_from_env: true,
    domain: process.env.NGROK_DOMAIN,
  });
  console.log(`Live at ${url.url()}\nPress Enter to stop the server`);

  const rl = createInterface({ input: process.stdin, output: process.stdout });
  rl.on('line', async () => {
    await kill();
    rl.close();
  });
}

ngrokSession();
