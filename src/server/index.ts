import { Hono } from "hono";
import { serveStatic } from "hono/bun";

const server = new Hono();
server
  .use("/style.css", serveStatic({ path: "./src/server/style.css" }))
  .use("/dist/*", serveStatic({ root: "./" }))
  .use("/atv", serveStatic({ path: "./src/server/index.html" }));

export default { port: 8080, fetch: server.fetch };
