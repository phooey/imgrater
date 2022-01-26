import { AzureStorageImageManager } from '../../src/utils'
import express from 'express'
import { start } from '../../src'

jest.mock('express', () => {
  return jest.fn().mockReturnValue({
    listen: jest.fn(),
    use: jest.fn(),
  })
})
jest.mock('../../src/middleware')
jest.mock('../../src/utils')

describe('start', () => {
  let app: express.Application
  const config = {
    port: 9001,
    connectionString: 'dummy-connection-string',
  }

  beforeEach(async() => {
    jest.clearAllMocks()
    process.env = {}
    process.env.AZURE_STORAGE_CONNECTION_STRING = config.connectionString
    process.env.PORT = String(config.port)
    app = await start()
  })

  it('should call listen with the configured port on the express application', async() => {
    expect(app.listen).toHaveBeenCalledWith(config.port, expect.anything())
  })

  it('should create Azure Storage Image Manager with the configured connection string and default container name', async() => {
    expect(AzureStorageImageManager).toHaveBeenCalledWith(config.connectionString, 'imgrater-images')
  })
})
