import { describe, it, expect } from 'bun:test'
import { app } from '../../index'

describe('Edital Integration Suite', () => {
  let createdId: number
  const today = new Date()
  const nextMonth = new Date()
  nextMonth.setMonth(today.getMonth() + 1)

  const mockEdital = {
    title: 'Edital de Teste Automatizado',
    description: 'Descrição completa para teste de integração',
    registrationStartDate: today.toISOString(),
    registrationEndDate: nextMonth.toISOString(),
    foodAllowance: true,
    housingAllowance: false
  }

  const updatedEditalPayload = {
    title: 'Edital Atualizado',
    description: 'Descrição atualizada via PUT',
    housingAllowance: true 
  }

  it('should create a new edital successfully', async () => {
    const response = await app.handle(
      new Request('http://localhost/editais/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockEdital)
      })
    )

    if (response.status !== 200) {
      console.error(await response.json())
    }

    expect(response.status).toBe(200)
    
    const data = await response.json()
    expect(data).toHaveProperty('id')
    expect(data.title).toBe(mockEdital.title)
    expect(data.foodAllowance).toBe(true)
    
    createdId = data.id
  })

  it('should retrieve all editais', async () => {
    const response = await app.handle(new Request('http://localhost/editais/'))
    
    expect(response.status).toBe(200)
    
    const data = await response.json()
    expect(Array.isArray(data)).toBe(true)
    
    const exists = data.find((item: any) => item.id === createdId)
    expect(exists).toBeDefined()
  })

  it('should retrieve active editais', async () => {
    const response = await app.handle(new Request('http://localhost/editais/active'))
    
    expect(response.status).toBe(200)
    
    const data = await response.json()
    expect(Array.isArray(data)).toBe(true)
    
    const exists = data.find((item: any) => item.id === createdId)
    expect(exists).toBeDefined()
  })

  it('should retrieve the specific edital by id', async () => {
    const response = await app.handle(new Request(`http://localhost/editais/${createdId}`))
    
    expect(response.status).toBe(200)
    
    const data = await response.json()
    expect(data.id).toBe(createdId)
    expect(data.title).toBe(mockEdital.title)
  })

  it('should update the existing edital', async () => {
    const response = await app.handle(
      new Request(`http://localhost/editais/${createdId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedEditalPayload)
      })
    )

    expect(response.status).toBe(200)
    
    const data = await response.json()
    expect(data.id).toBe(createdId)
    expect(data.title).toBe(updatedEditalPayload.title)
    expect(data.housingAllowance).toBe(true)
  })

  it('should delete the edital', async () => {
    const response = await app.handle(
      new Request(`http://localhost/editais/${createdId}`, {
        method: 'DELETE'
      })
    )

    expect(response.status).toBe(200)
    
    const data = await response.json()
    expect(data.message).toBe('Edital deleted successfully')
  })

  it('should return 404 when trying to get a deleted edital', async () => {
    const response = await app.handle(new Request(`http://localhost/editais/${createdId}`))
    
    expect(response.status).toBe(404)
  })
})