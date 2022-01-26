import { IWorldOptions, World } from '@cucumber/cucumber'
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

export class CustomWorld extends World {
  public axios: AxiosInstance
  public hash!: string
  public response!: AxiosResponse
  public uuid!: string

  constructor(options: IWorldOptions) {
    super(options)
    if (process.env.ACCEPTANCE_TEST_BASE_URL == undefined) {
      throw new Error('Environment variable "ACCEPTANCE_TEST_BASE_URL" must be set')
    }
    this.axios = axios.create({
      baseURL: process.env.ACCEPTANCE_TEST_BASE_URL,
      timeout: 1000,
      maxBodyLength: Infinity,
    })
    // Ignore all errors based on a non 2xx status code as we check the status codes ourselves
    this.axios.interceptors.response.use(response => {
      return response
    }, error => {
      if (!error.response) {
        throw error
      }
      return error.response
    })
  }

  public attachImageResponse(response: AxiosResponse) {
    this.attach(`HTTP Status Code: ${response.status}`)
    this.attachImage('HTTP Response Body:', response.data as Buffer)
  }

  public attachImage(description: string, imageData: Buffer) {
    this.attach(description)
    this.attach(imageData, 'image/png')
  }

  public attachJsonResponse(response: AxiosResponse) {
    this.attach(`HTTP Status Code: ${response.status}`)
    this.attach('HTTP Response Body:')
    this.attach(JSON.stringify(response.data, undefined, 2), 'application/json')
  }

  public attachMD5Hash(description: string, md5Hash: string) {
    this.attach(`MD5 hash for ${description}:`)
    this.attach(`<pre>${md5Hash}</pre>`, 'text/html')
  }

  public attachRequestConfig(requestConfig: AxiosRequestConfig) {
    this.attach('HTTP Request Config:')
    this.attach(JSON.stringify(requestConfig, undefined, 2), 'application/json')
  }

  public attachRequestConfigWithoutData(requestConfig: AxiosRequestConfig) {
    const requestConfigWithoutData = Object.assign({}, requestConfig)
    requestConfigWithoutData.data = `-- form data with length ${requestConfig.data.getLengthSync()} --`
    this.attachRequestConfig(requestConfigWithoutData)
  }

  public async performRequest(requestConfig: AxiosRequestConfig, attachRequestConfigData = true): Promise<AxiosResponse> {
    if (attachRequestConfigData) {
      this.attachRequestConfig(requestConfig)
    } else {
      this.attachRequestConfigWithoutData(requestConfig)
    }
    return await this.axios(requestConfig)
  }
}
