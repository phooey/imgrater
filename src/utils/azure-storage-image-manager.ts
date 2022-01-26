import { BlobServiceClient, ContainerClient } from '@azure/storage-blob'
import { ImageManager } from '.'
import { ImageRatingDirection } from './image-manager'
import { getLogger } from 'log4js'
import { v1 as uuid } from 'uuid'

const logger = getLogger('utils.azure-storage-image-manager')

export class AzureStorageImageManager implements ImageManager {

  private blobServiceClient: BlobServiceClient
  private containerClient: ContainerClient

  constructor(connectionString: string, containerName: string) {
    this.blobServiceClient = BlobServiceClient.fromConnectionString(connectionString)
    this.containerClient = this.blobServiceClient.getContainerClient(containerName)
  }

  public async init(): Promise<void> {
    try {
      await this.containerClient.createIfNotExists()
    } catch (error) {
      throw new Error(`Could not initiate Azure Storage: ${error}`)
    }
  }

  public async saveImage(data: Buffer, size: number): Promise<string> {
    const blobName = uuid()
    const blockBlockClient = this.containerClient.getBlockBlobClient(blobName)
    await blockBlockClient.upload(data, size)
    await blockBlockClient.setMetadata({ rating: '0' })
    return blobName
  }

  public async loadImage(uuid: string): Promise<NodeJS.ReadableStream> {
    const blockBlockClient = this.containerClient.getBlockBlobClient(uuid)
    const response = await blockBlockClient.download(0)

    if (!response || !response.readableStreamBody) {
      throw Error(`Could not load image with uuid ${uuid}`)
    }
    return response.readableStreamBody
  }

  public async hasImage(uuid: string): Promise<boolean> {
    const blobName = uuid
    let found = false
    for await (const blob of this.containerClient.listBlobsFlat()) {
      if (blob.name === blobName) {
        found = true
        break
      }
    }
    return found
  }

  public async getImageList(): Promise<string[]> {
    const images: string[] = []
    for await (const blob of this.containerClient.listBlobsFlat()) {
      images.push(blob.name)
    }
    return images
  }

  public async getImageRating(uuid: string): Promise<number> {
    const blobClient = this.containerClient.getBlobClient(uuid)
    const metadata = await (await blobClient.getProperties()).metadata
    logger.info(`blob "${uuid}" metadata: ${JSON.stringify(metadata)}`)

    if (!metadata || !metadata.rating) {
      throw new Error(`Metadata missing for blob with uuid ${uuid}`)
    }

    return parseInt(metadata.rating)
  }

  public async rateImage(uuid: string, direction: ImageRatingDirection): Promise<number> {
    const blobClient = this.containerClient.getBlobClient(uuid)
    const metadata = await (await blobClient.getProperties()).metadata
    logger.info(`blob "${uuid}" metadata: ${JSON.stringify(metadata)}`)

    if (!metadata || !metadata.rating) {
      throw new Error(`Metadata missing for blob with uuid ${uuid}`)
    }

    const currentRating = parseInt(metadata.rating)
    const newRating = (direction == ImageRatingDirection.Up) ? (currentRating + 1) : (currentRating - 1)

    await blobClient.setMetadata({ rating: String(newRating) })
    return newRating
  }

}
