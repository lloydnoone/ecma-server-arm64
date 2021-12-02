import 'reflect-metadata'
import { controller, post, use } from '../../../app/controllers/decorators'
import { App } from '../../../app/App'
import { AnyObject } from '../../../app/interfaces/AnyObject'

jest.mock('../../../app/controllers/RootController', () => jest.fn())
jest.mock('../../../app/controllers/LoginController', () => jest.fn())

/* eslint-disable-next-line @typescript-eslint/no-empty-function */
function testMiddleware() {}

@controller('/tests')
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
class TestClass {
  @post('/test')
  @use(testMiddleware)
  /* eslint-disable-next-line @typescript-eslint/no-empty-function */
  testFunc() {}
}

const app = new App()

beforeAll(done => {
  app.ApplyMiddleware()
  app.startServer()
  done()
})

afterAll(() => {
  app.closeServer()
})

describe('controller decorator test suite', () => {
  test('Should add correct route, method and middleware to router', () => {
    //pull off details from express router
    let route
    // define array to hold routes from express handler
    const routes: { 
      path: string, 
      methods: { 
        post: boolean 
      }, 
      stack: [
        Layer: {
          handle: AnyObject
        }
      ] 
    }[] = [];

    //get middleware for each route on the router
    app.getApp()._router.stack.forEach(function(middleware: AnyObject){
        if(middleware.name === 'router'){ // router middleware
            middleware.handle.stack.forEach(function(handler: AnyObject){
                handler.route && routes.push(handler.route);
            });
        }
    })
    expect(routes[1].path).toBe('/tests/test')
    expect(routes[1].methods.post).toBe(true)
    expect(routes[1].stack[0].handle).toBe(testMiddleware)
  })
})