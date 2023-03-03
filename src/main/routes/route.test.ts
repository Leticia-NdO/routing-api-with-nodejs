import app from '../config/app'
import request from 'supertest'

describe('Routing Routes', () => {
  describe('POST /route', () => {
    it('Should return 200 on sign up', async () => {
      await request(app).post('/api/v1/route')
        .send(
          {
            coordinates: [
              {
                id: 1, // Atacadão - Taboão da Serra
                lat: -23.606997872564072,
                lon: -46.76229420947422
              },
              {
                id: 2, // Vila Santa Catarina
                lat: -23.655728956536628,
                lon: -46.69302839465839
              },
              {
                id: 3, // Shopping Interlagos
                lat: -23.672328669654295,
                lon: -46.675916886341575
              }
            ]
          }
        )
        .expect(200)
    })

    it('Should return 400 when given invalid coordinates', async () => {
      await request(app).post('/api/v1/route')
        .send({
          coordinates: [
            {
              id: 1, // Atacadão - Taboão da Serra
              lat: -100,
              lon: -46.76229420947422
            },
            {
              id: 2, // Vila Santa Catarina
              lat: -23.655728956536628,
              lon: -46.69302839465839
            },
            {
              id: 3, // Shopping Interlagos
              lat: -23.672328669654295,
              lon: -46.675916886341575
            }
          ]
        })
        .expect(400)
    })
  })
})
