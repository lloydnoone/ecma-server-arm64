import { Request, Response } from 'express'
import { controller, bodyValidator, post, use } from './decorators'
import { logger } from './middleware/logger'
import { Controller } from '../controllers/Controller'
import { NodeVM } from 'vm2'
import { isDeepStrictEqual } from 'util';
import { AnyObject } from '../interfaces/AnyObject'

function deepEqual(object1: AnyObject, object2: AnyObject): boolean {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);
  if (keys1.length !== keys2.length) {
    return false;
  }
  for (const key of keys1) {
    const val1 = object1[key];
    const val2 = object2[key];
    const areObjects = isObject(val1) && isObject(val2);
    if (
      areObjects && !deepEqual(val1, val2) ||
      !areObjects && val1 !== val2
    ) {
      return false;
    }
  }
  return true;
}

function isObject(object: AnyObject) {
  return object != null && typeof object === 'object';
}

function ObjectCompareResult(usersObject: AnyObject, correctObject: AnyObject): string {
  const keys1 = Object.keys(usersObject);
  const keys2 = Object.keys(correctObject);
  if (keys1.length !== keys2.length) {
    return "some properties are missing!";
  }
  for (const key of keys1) {
    const val1 = usersObject[key];
    const val2 = correctObject[key];
    const areObjects = isObject(val1) && isObject(val2);
    if (
      areObjects && !deepEqual(val1, val2) ||
      !areObjects && val1 !== val2
    ) {
      //throw new Error(`${val1} is not equal to ${val2}`)
      return `${key} should not be ${val1}`;
    }
  }
  return "Correct";
}

// set defaults for VM
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
  @post('/vardeclaration')
  @bodyValidator('snippet')
  @use(logger)
  varDeclaration(req: Request, res: Response): void {
    const { snippet } = req.body

    if (snippet === '') {
      res.status(422).send('Invalid snippet received.')
    }

    try {
      const testFunction = vm.run(`
      "use strict";
      ${snippet}
      
      module.exports = function() {
          return {
            results: {
              open: open
            }
          }
        }
      `)
      
      if (testFunction().results.open === true) {
        res.status(200).send({ message: 'Test passed' })
      } else {
        res.status(200).send({ message: 'Test failed',
        error: { 
          message: `open is ${testFunction().results.open}, should be true`,
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

  @post('/primitivetypes')
  @bodyValidator('snippet')
  @use(logger)
  primitiveTypes(req: Request, res: Response): void {
    const { snippet } = req.body

    if (snippet === '') {
      res.status(422).send('Invalid snippet received.')
    }

    try {
      const testFunction = vm.run(`
      "use strict";
      ${snippet}

      module.exports = function() {
          return {
            results: {
              userName: userName,
              passCode: passCode,
              open: open
            }
          }
      }`)
      
      //compare results of users code to correct answer
      const result = ObjectCompareResult(
        testFunction().results, 
        {
          userName: "Admin",
          passCode: 8897,
          open: true
        })

      // if result is not correct it will be an error message so use that in response
      if (result === "Correct") 
      {
        res.status(200).send({ message: 'Test passed' })
      } else {
        res.status(200).send({ message: 'Test failed',
        error: { 
          message: result,
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

  @post('/reassignment')
  @bodyValidator('snippet')
  @use(logger)
  reassignment(req: Request, res: Response): void {
    const { snippet } = req.body

    if (snippet === '') {
      res.status(422).send('Invalid snippet received.')
    }

    try {
      const testFunction = vm.run(`
      
      let open = false

      ${snippet}
      
      module.exports = function() {
          return {
            results: {
              open: open
            }
          }
        }
      `)
      
      if (testFunction().results.open === false) {
        res.status(200).send({ message: 'Test passed' })
      } else {
        res.status(200).send({ message: 'Test failed',
        error: { 
          message: `open is ${testFunction().results.open}, should be false`,
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