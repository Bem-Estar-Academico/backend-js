import { t } from 'elysia'
import { createSelectSchema } from 'drizzle-typebox'
import { editaisTable } from '@/db/schema'

const editalSchema = createSelectSchema(editaisTable)

export namespace EditalModel {
  export const listAllResponse = t.Array(editalSchema)
  export type listAllResponse = typeof listAllResponse.static

  export const listAllInvalid = t.Literal('Something unexpected happened :(')
	export type listAllInvalid = typeof listAllInvalid.static

  export const editalResponse = editalSchema
  export type editalResponse = typeof editalResponse.static
}