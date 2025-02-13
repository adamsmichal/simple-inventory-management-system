import { createApp } from 'src/app/app';

(async () => {
  const app = await createApp();
  process.on('uncaughtException', err => {
    console.error(`Uncaught: ${err.toString()}`, err);
    process.exit(1);
  });

  process.on('unhandledRejection', (err: any) => {
    if (err) {
      console.error(`Unhandled: ${err.toString()}`, err);
    }
    process.exit(1);
  });

  const { server, port } = app;
  server.listen(port);
  console.info(`listening on port: ${port}`);
})();
