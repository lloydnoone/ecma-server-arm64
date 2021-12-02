import { Request, Response } from 'express'
import { controller, bodyValidator, post, use } from './decorators'
import { logger } from './middleware/logger'
import { Controller } from '../controllers/Controller'
import { NodeVM } from 'vm2'

const vm: NodeVM = new NodeVM({
  console: 'inherit',
  sandbox: {},
  eval: false,
  wasm: false,
  require: {
      external: false,
      builtin: [],
      root: "./",
      mock: {}
  }
});

@controller('/tests')
export class TestController extends Controller {
  @post('/test')
  @bodyValidator('snippet')
  @use(logger)
  postSnippet(req: Request, res: Response): void {
    const { snippet } = req.body

    if (snippet === '') {
      res.status(422).send('Invalid snippet received.')
    }

    try {
      const testFunction = vm.run(`${snippet}

      module.exports = function() {
        if(testvar === 1) {
          const results = {pass: true, testvar: testvar}
          return results
        } else {
          const results = {pass: false, testvar: testvar}
          return results
        }
      }`)
      
      if (testFunction().pass) {
        res.status(200).send({ message: 'Test passed after updating' })
      } else {
        res.status(200).send({ message: 'Test failed',
        error: { 
          message: `testvar = ${testFunction().testvar}, should be 1`,
          name: 'Incorrect',
          stack: '',
          lineNumber: 0
        }})
      }
      // any errors in the users code will br thrown as an actual error here
      // however we still want to respond normally to the client with 200 and their error msg
    } catch (error: unknown) {
      // vm2 function sends back plain object as error, cast this to SyntaxError
      const err = error as SyntaxError
      // if the error from vm was other than users syntax, throw real error
      if (!err.stack) err.stack = 'stack undefined'

      res.status(200).send({ message: 'invalid JS.', 
      error: { 
        message: err.message,
        name: err.name,
        stack: err.stack,
        lineNumber: err.stack.split('\n')[0].replace('vm.js:','')
      }})
    }
  }
}