import { t } from 'elysia'
import { createSelectSchema } from 'drizzle-typebox'
import { editaisTable } from '@/db/schema'

const editalBaseSchema = createSelectSchema(editaisTable, {
  registrationStartDate: t.Date(),
  registrationEndDate: t.Nullable(t.Date()),
  appealStartDate: t.Nullable(t.Date()),
  appealEndDate: t.Nullable(t.Date()),
  preliminaryResultDate: t.Nullable(t.Date()),
  finalResultDate: t.Nullable(t.Date()),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});

export namespace EditalModel {
  export const listAllResponse = t.Array(editalBaseSchema)
  export type listAllResponse = typeof listAllResponse.static
  export const editalResponse = editalBaseSchema
  export type editalResponse = typeof editalResponse.static
  export const listAllInvalid = t.Object({
    message: t.String(),
    status: t.Number()
  })
}