import { db } from '@/db'
import { status } from 'elysia'
import { and, eq, gt, isNull, lte, or } from 'drizzle-orm'
import { editaisTable } from '@/db/schema'
import type { EditalModel } from './model'

export abstract class Edital {
  static async getAll() {
    const editais = await db
      .select()
      .from(editaisTable)

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
      throw status(404, 'Edital not found')
    }
    
    return edital
  }

  static async create(data: EditalModel.createBody) {
    try {
      const [edital] = await db
        .insert(editaisTable)
        .values(data as any)
        .returning()
      
      return edital
    } catch (err) {
      throw status(400, 'Failed to create edital')
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
      throw status(400, 'Failed to update edital')
    }

    if (!edital) {
      throw status(404, 'Edital not found')
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
      throw status(400, 'Failed to delete edital')
    }

    if (!edital) {
      throw status(404, 'Edital not found')
    }

    return edital
  }
}