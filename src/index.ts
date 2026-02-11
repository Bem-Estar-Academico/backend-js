import { db } from './db';
import { Elysia } from "elysia";
import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import { editalRoutes } from './routes/editais';

const app = new Elysia()
  .use(cors())
  .use(swagger({
    path: '/docs',
    documentation: {
      info: {
        title: 'BEA API Documentation',
        version: '1.0.0'
      }
    }
  }))
  .decorate('db', db)
  .get("/", () => ({ message: "BEA API" }))
  .use(editalRoutes)
  .listen(3000);

console.log(`Elysia is running at ${app.server?.hostname}:${app.server?.port}`);