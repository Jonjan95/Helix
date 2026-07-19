import { createServer } from "node:http";
import next from "next";

export default async function globalSetup() {
  const app = next({ dev: false, dir: process.cwd() });
  const handler = app.getRequestHandler();

  await app.prepare();

  const server = createServer((request, response) => {
    void handler(request, response);
  });

  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(3000, resolve);
  });

  return async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
    await app.close();
  };
}
