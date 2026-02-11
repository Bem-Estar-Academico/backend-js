import { Elysia, t } from 'elysia'
import { Edital } from './service'
import { EditalModel } from './model'

export const edital = new Elysia({ prefix: '/editais' })
  .get(
    '/',
    async () => {
      return Edital.getAll() 
    }, {
      response: {
        200: EditalModel.getAllResponse,
      }
    }
  )
  .get(
    '/active', 
    async () => {
      return Edital.getActives() 
    }, {
      response: {
        200: EditalModel.getActivesResponse,
      }
    }
  )
  .get(
    '/:id',
    async ({ params: { id } }) => {
      return Edital.getEditalById(Number(id))
    }, {
      response: {
        200: EditalModel.editalResponse,
        404: t.Object({ message: t.String() })
      },
      params: t.Object({
        id: t.Numeric()
      })
    }
  )
  .post(
    '/',
    async ({ body }) => {
      return Edital.create(body)
    }, {
      body: EditalModel.createBody,
      response: {
        200: EditalModel.editalResponse,
        400: t.Object({ message: t.String() })
      }
    }
  )
  .put(
    '/:id',
    async ({ params: { id }, body }) => {
      return Edital.update(Number(id), body)
    }, {
      params: t.Object({
        id: t.Numeric()
      }),
      body: EditalModel.updateBody,
      response: {
        200: EditalModel.updateResponse,
        400: t.Object({ message: t.String() }),
        404: t.Object({ message: t.String() })
      }
    }
  )
  .delete(
    '/:id',
    async ({ params: { id } }) => {
      const edital = await Edital.delete(Number(id))
      return { message: 'Edital deleted successfully', edital }
    }, {
      params: t.Object({
        id: t.Numeric()
      }),
      response: {
        200: t.Object({
          message: t.String(),
          edital: EditalModel.editalResponse
        }),
        404: t.Object({ message: t.String() })
      }
    }
  )