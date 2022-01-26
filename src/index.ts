import { AzureStorageImageManager } from './utils'
import express from 'express'
import { getLogger } from 'log4js'
import { registerRoutes } from './middleware'
import { validateConfig } from './config'

const logger = getLogger('service.init')

export const start = async(): Promise<express.Application> => {
  const appConfig = validateConfig()

  const imageManager = new AzureStorageImageManager(appConfig.AZURE_STORAGE_CONNECTION_STRING, appConfig.AZURE_STORAGE_CONTAINER_NAME)
  await imageManager.init()

  const app: express.Application = express()
  const middleware = registerRoutes(imageManager)
  app.use(middleware)

  app.listen(appConfig.PORT, function() {
    logger.info(`App is listening on port ${appConfig.PORT}`)
  })
  return app
}
