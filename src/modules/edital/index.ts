import { Elysia } from 'elysia'
import { Edital } from './service'
import { EditalModel } from './model'
import { t } from 'elysia'; 

export const edital = new Elysia({ prefix: '/editais' })
  .get(
    '/',
    async () => {
      return Edital.listAll() 
    }, {
			response: {
				200: EditalModel.listAllResponse,
			}
		}
  )
  .get(
    '/:id',
    async ({ params: { id } }) => {
      return Edital.getEditalById(id)
    }, {
			response: {
				200: EditalModel.editalResponse,
			},
      params: t.Object({
        id: t.Number()
      })
		}
  )
  .get('/active', async () => {
  });
