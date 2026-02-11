import { db } from '../db';
import { Elysia } from 'elysia';
import { eq } from 'drizzle-orm';
import * as schema from '../db/schema';

export const editalRoutes = new Elysia({ prefix: '/editais' })
  .get('/', async () => {
    return await db.select().from(schema.editaisTable);
  })
  .get('/:id', async ({ params: { id } }) => {
    const result = await db.select()
    .from(schema.editaisTable)
    .where(eq(schema.editaisTable.id, Number(id)));
    return result[0] ?? null;
  });