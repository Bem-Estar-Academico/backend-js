import { db } from './db';
import { Elysia } from "elysia";
import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import { edital } from './modules/edital';
import pkg from '../package.json';

export const app = new Elysia()
  .use(cors())
  .use(swagger({
    path: '/docs',
    documentation: {
      info: {
        title: 'BEA API Documentation',
        version: pkg.version
      }
    }
  }))
  .decorate('db', db)
  .get("/", () => ({ message: "BEA API" }))
  .use(edital);

if (process.env.NODE_ENV !== 'test') {
  app.listen(3000);
  console.log(`Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
}