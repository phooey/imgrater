import 'dotenv/config'
import Joi from '@hapi/joi'
import { getLogger } from 'log4js'

const logger = getLogger('config')

const configSchema = Joi.object({
  AZURE_STORAGE_CONNECTION_STRING: Joi.string().required(),
  AZURE_STORAGE_CONTAINER_NAME: Joi.string().default('imgrater-images'),
  PORT: Joi.number().default(9001),
}).unknown(true)

export interface ApplicationConfig {
  AZURE_STORAGE_CONNECTION_STRING: string
  AZURE_STORAGE_CONTAINER_NAME: string
  PORT: number
}

export const validateConfig = (): ApplicationConfig => {
  const validationResult = configSchema.validate(process.env)
  if (validationResult.error) {
    const errorMessage = `Invalid configuration: ${validationResult.error.details[0].message}`
    logger.error(errorMessage)
    throw new Error(errorMessage)
  }

  const config: ApplicationConfig = {
    AZURE_STORAGE_CONNECTION_STRING: validationResult.value.AZURE_STORAGE_CONNECTION_STRING,
    AZURE_STORAGE_CONTAINER_NAME: validationResult.value.AZURE_STORAGE_CONTAINER_NAME,
    PORT: validationResult.value.PORT,
  }

  return config
}
