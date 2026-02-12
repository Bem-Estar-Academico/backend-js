import { t } from 'elysia'
import { createInsertSchema, createSelectSchema } from 'drizzle-typebox'
import { editaisTable } from '@/db/schema'

const editalSchema = createSelectSchema(editaisTable)
const insertEditalSchema = createInsertSchema(editaisTable)


export namespace EditalModel {
  // Response types
  export const getAllResponse = t.Array(editalSchema)
  export type getAllResponse = typeof getAllResponse.static

  export const editalResponse = editalSchema
  export type editalResponse = typeof editalResponse.static

  export const getActivesResponse = t.Array(editalSchema)
  export type getActivesResponse = typeof getActivesResponse.static
  
  export const updateResponse = editalSchema
  export type updateResponse = typeof updateResponse.static

  // Body types
  export const createBody = t.Omit(insertEditalSchema, ['id', 'createdAt', 'updatedAt'])
  export type createBody = typeof createBody.static

  export const updateBody = t.Partial(t.Omit(insertEditalSchema, ['id', 'createdAt', 'updatedAt']))
  export type updateBody = typeof updateBody.static

}