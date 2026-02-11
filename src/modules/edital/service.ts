import { db } from '@/db'
import { status } from 'elysia'
import { eq } from 'drizzle-orm'
import type { EditalModel } from './model'
import { editaisTable } from '@/db/schema'

export abstract class Edital {
  static async listAll() {
    try {
      const editais = await db
        .select()
        .from(editaisTable)

      return editais
    }
    catch {
      throw status(
				500,
				'Internal Server Error'
			)
    }
  }

  static async getEditalById(id: number) {
    const edital = await db
      .select()
      .from(editaisTable)
      .where(eq(editaisTable.id, id))

    return edital[0];
  }

  static async updateEdital(id: number, data: any) {
    const [edital] = await db
      .update(editaisTable)
      .set(data)
      .where(eq(editaisTable.id, id))
      .returning()

    return edital;
  }
}

