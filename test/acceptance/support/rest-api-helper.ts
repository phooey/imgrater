import { AxiosRequestConfig } from 'axios'
import FormData from 'form-data'

export class RestApiHelper {
  public static getImageRequest(uuid: string): AxiosRequestConfig {
    return {
      method: 'get',
      url: `/images/${uuid}`,
      responseType: 'arraybuffer',
    }
  }

  public static getImagesRequest(): AxiosRequestConfig {
    return {
      method: 'get',
      url: '/images',
    }
  }

  public static getImageRatingRequest(uuid: string): AxiosRequestConfig {
    return {
      method: 'get',
      url: `/images/${uuid}/rating`,
    }
  }

  public static postImageRatingRequest(uuid: string, direction: string): AxiosRequestConfig {
    return {
      method: 'post',
      url: `/images/${uuid}/rating`,
      data: { direction },
    }
  }

  public static postImageRequest(fileName: string, imageData: Buffer): AxiosRequestConfig {
    const form = new FormData()
    form.append('image', imageData, fileName)
    return {
      method: 'post',
      url: '/images',
      headers: {
        ...form.getHeaders(),
      },
      data: form,
    }
  }
}
