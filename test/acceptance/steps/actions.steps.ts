import { CustomWorld, RestApiHelper, TestUtils } from '../support'
import { defineStep } from '@cucumber/cucumber'
import { expect } from 'chai'

defineStep('Alice is a user', function(this: CustomWorld) {
  return true
})

defineStep('Alice uploads the file/image {string}', async function(this: CustomWorld, imageFileName: string) {
  const imageData = TestUtils.readImageFromFile(imageFileName)
  this.response = await this.performRequest(RestApiHelper.postImageRequest(imageFileName, imageData), false)
})

defineStep('Alice has successfully uploaded the file/image {string}', async function(this: CustomWorld, imageFileName: string) {
  const imageData = TestUtils.readImageFromFile(imageFileName)
  this.response = await this.performRequest(RestApiHelper.postImageRequest(imageFileName, imageData), false)
  this.attachJsonResponse(this.response)
  expect(this.response.status).to.equal(201)
})

defineStep('Alice has unsuccessfully tried to uploaded the file/image {string}', async function(this: CustomWorld, imageFileName: string) {
  const imageData = TestUtils.readImageFromFile(imageFileName)
  this.response = await this.performRequest(RestApiHelper.postImageRequest(imageFileName, imageData), false)
  this.attachJsonResponse(this.response)
  expect(this.response.status).to.equal(400)
})

defineStep('Alice downloads the image with the noted UUID', async function(this: CustomWorld) {
  this.response = await this.performRequest(RestApiHelper.getImageRequest(this.uuid))
})

defineStep('Alice downloads the image with the UUID {string}', async function(this: CustomWorld, uuid: string) {
  this.response = await this.performRequest(RestApiHelper.getImageRequest(uuid))
})

defineStep('Alice retrieves the list of images', async function(this: CustomWorld) {
  this.response = await this.performRequest(RestApiHelper.getImagesRequest())
})

defineStep('Alice retrieves the rating for the image with the UUID {string}', async function(this: CustomWorld, uuid: string) {
  this.response = await this.performRequest(RestApiHelper.getImageRatingRequest(uuid))
})

defineStep('Alice retrieves the rating for the image with the noted UUID', async function(this: CustomWorld) {
  this.response = await this.performRequest(RestApiHelper.getImageRatingRequest(this.uuid))
})

defineStep('Alice has hashed the image {string}', function(this: CustomWorld, imageFileName: string) {
  const imageData = TestUtils.readImageFromFile(imageFileName)
  this.hash = TestUtils.hashImage(imageData)
  this.attachMD5Hash(`file "${imageFileName}"`, this.hash)
  this.attachImage(`Image with file name "${imageFileName}"`, imageData)
})

defineStep('Alice rates the image with the UUID {string} {direction}', async function(this: CustomWorld, uuid: string, direction: string) {
  this.response = await this.performRequest(RestApiHelper.postImageRatingRequest(uuid, direction))
})

defineStep('Alice has successfully rated the image with the noted UUID {direction}', async function(this: CustomWorld, direction: string) {
  this.response = await this.performRequest(RestApiHelper.postImageRatingRequest(this.uuid, direction))
  this.attachJsonResponse(this.response)
  expect(this.response.status).to.equal(200)
})

defineStep('Alice has successfully rated the image with the UUID {string} {direction}', async function(this: CustomWorld, uuid: string, direction: string) {
  this.response = await this.performRequest(RestApiHelper.postImageRatingRequest(uuid, direction))
  this.attachJsonResponse(this.response)
  expect(this.response.status).to.equal(200)
})

defineStep('Alice tries to rate the image with the noted UUID with an invalid direction', async function(this: CustomWorld) {
  this.response = await this.performRequest(RestApiHelper.postImageRatingRequest(this.uuid, 'invalid'))
})
