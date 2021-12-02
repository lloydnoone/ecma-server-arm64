import { App } from '../app/App'
//import { AppRouter } from '../app/AppRouter'

//jest.mock('../app/AppRouter')

//mock decorators
jest.mock('../app/controllers/RootController', () => jest.fn())
jest.mock('../app/controllers/LoginController', () => jest.fn())
jest.mock('../app/controllers/TestController', () => jest.fn())
jest.mock('../app/controllers/decorators/controller', () => jest.fn())

const app = new App()

beforeAll(done => {
  app.ApplyMiddleware()
  app.startServer()
  done()
})

afterAll(() => {
  app.closeServer()
})

describe('Server test suite', () => {
  test('should be able to create server on port 5000', done => {
    setTimeout(() => {
      expect(app.getPort()).toBe(5000)
      done()
    }, 100)
  })
})