import { Before, setDefaultTimeout, setWorldConstructor } from '@cucumber/cucumber'
import { BlobServiceClient } from '@azure/storage-blob'
import { CustomWorld } from '../support'
import { validateConfig } from '../../../src/config'

setDefaultTimeout(10 * 1000)

const config = validateConfig()

Before(async() => {
  const blobServiceClient: BlobServiceClient = BlobServiceClient.fromConnectionString(String(config.AZURE_STORAGE_CONNECTION_STRING))
  const containerClient = blobServiceClient.getContainerClient(config.AZURE_STORAGE_CONTAINER_NAME)
  await containerClient.deleteIfExists()
  await containerClient.createIfNotExists()
})

setWorldConstructor(CustomWorld)
