import { connectLogger, getLogger } from 'log4js'
import { ImageManager } from '../utils'
import { Router } from 'express'
import { registerImagesRoute } from './routes'

const logger = getLogger('routes')

export const registerRoutes = (imageManager: ImageManager): Router => {
  const router = Router()
  router.use(connectLogger(logger, { level: 'info' }))
  registerImagesRoute(router, imageManager)
  return router
}
