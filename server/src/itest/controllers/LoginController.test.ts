import { request } from '../../test/helper'
import { Response } from 'supertest';

const loginCorrect = {
  email: 'lloyd@email.com',
  password: 'pass'
}

const loginIncorrect = {
  email: 'test@test.test',
  password: 'wrong'
}

describe('GET /login', () => {
  test('should return a 200 response', done => {
    request
    .get('/auth/login')
    .end((err: Error, res: Response) => {
      expect(res.status).toBe(200)
      done()
    })
  })
})

describe('POST /login', () => {
  test('should return a 401 unauthorised response for incorrect login details', done => {
    request
      .post('/auth/login')
      .type('form')
      .send(loginIncorrect)
      .end((err: Error, res: Response) => {
        expect(res.status).toBe(401)
        done()
      })
  })

  test('should return a 302 redirect response for correct login details', done => {
    request
      .post('/auth/login')
      .type('form')
      .send(loginCorrect)
      .end((err: Error, res: Response) => {
        expect(res.status).toBe(302)
        done()
      })
  })
})

describe('GET /logout', () => {
  test('should return 302 redirect response', done => {
  request
    .get('/auth/logout')
    .end((err: Error, res: Response) => {
      expect(res.status).toBe(302)
      done()
    })
  })
})