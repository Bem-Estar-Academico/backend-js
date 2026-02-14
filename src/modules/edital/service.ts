import { db } from '@/db'
import { status } from 'elysia'
import { and, eq, gt, isNull, lte, or, sql } from 'drizzle-orm'
import { editaisTable } from '@/db/schema'
import type { EditalModel } from './model'

export abstract class Edital {
  static async getAll(options?: { year?: number; page?: number; limit?: number }) {
    const { year, page = 1, limit = 10 } = options || {}
    const offset = (page - 1) * limit

    const whereConditions = []
    if (year) {
      whereConditions.push(sql`EXTRACT(YEAR FROM ${editaisTable.registrationStartDate}) = ${year}`)
    }

    const editais = await db
      .select()
      .from(editaisTable)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      .limit(limit)
      .offset(offset)

    return editais
  }

  static async getActives() {
    const now = new Date()
    const editais = await db
      .select()
      .from(editaisTable)
      .where(
        and(
          lte(editaisTable.registrationStartDate, now),
          or(
            isNull(editaisTable.registrationEndDate),
            gt(editaisTable.registrationEndDate, now)
          )
        )
      )

    return editais
  }

  static async getEditalById(id: number) {
    const [edital] = await db
      .select()
      .from(editaisTable)
      .where(eq(editaisTable.id, id))

    if (!edital) {
      throw status(404, { message: 'Edital not found' })
    }

    return edital
  }

  static async create(data: EditalModel.createBody) {
    try {
      const [edital] = await db
        .insert(editaisTable)
        .values(data)
        .returning()

      return edital
    } catch (err) {
      console.error(err)
      throw status(400, { message: 'Failed to create edital' })
    }
  }

  static async update(id: number, data: Partial<EditalModel.createBody>) {
    let edital
    try {
      ;[edital] = await db
        .update(editaisTable)
        .set(data)
        .where(eq(editaisTable.id, id))
        .returning()
    } catch (err) {
      console.error(err)
      throw status(400, { message: 'Failed to update edital' })
    }

    if (!edital) {
      throw status(404, { message: 'Edital not found' })
    }

    return edital
  }

  static async delete(id: number) {
    let edital
    try {
      ;[edital] = await db
        .delete(editaisTable)
        .where(eq(editaisTable.id, id))
        .returning()
    } catch (err) {
      console.error(err)
      throw status(400, { message: 'Failed to delete edital' })
    }

    if (!edital) {
      throw status(404, { message: 'Edital not found' })
    }

    return edital
  }
}