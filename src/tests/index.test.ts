import { describe, it, expect } from 'bun:test'
import { app } from '../index'

describe('API Basic Health', () => {
  it('should return 200 and health message from root', async () => {
    const response = await app.handle(new Request('http://localhost/'))
    
    expect(response.status).toBe(200)
    
    const data = await response.json()
    expect(data).toEqual({ message: 'BEA API' })
  })

  it('should have swagger documentation available', async () => {
    const response = await app.handle(new Request('http://localhost/docs'))
    expect(response.status).toBe(200)
  })
})
