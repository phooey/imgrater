export enum ImageRatingDirection {
  Up = 'up',
  Down = 'down'
}

export interface ImageManager {
  saveImage(data: Buffer, size: number): Promise<string>
  loadImage(uuid: string): Promise<NodeJS.ReadableStream>
  hasImage(uuid: string): Promise<boolean>
  getImageList(): Promise<string[]>
  getImageRating(uuid: string): Promise<number>
  rateImage(uuid: string, direction: ImageRatingDirection): Promise<number>
}
