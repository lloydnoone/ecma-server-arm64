import express from 'express'
import { AppRouter } from '../app/AppRouter'

describe('AppRouter test suite', () => {
  test('Should return an instance of an express router', () => {
    const instance = AppRouter.getInstance()
      expect(instance.name).toEqual(express.Router().name)
  })
})