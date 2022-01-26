
import { CustomWorld, TestUtils } from '../support'
import chai, { expect } from 'chai'
import chaiArrays from 'chai-arrays'
import chaiUuid from 'chai-uuid'
import { defineStep } from '@cucumber/cucumber'

chai.use(chaiUuid)
chai.use(chaiArrays)

defineStep('the upload finishes successfully', function(this: CustomWorld) {
  this.attachJsonResponse(this.response)
  expect(this.response.status).to.equal(201)
})

defineStep('the image is successfully downloaded', function(this: CustomWorld) {
  this.attachImageResponse(this.response)
  expect(this.response.status).to.equal(200)
})

defineStep('a valid UUID for the image is returned', function(this: CustomWorld) {
  this.attachJsonResponse(this.response)
  expect(this.response.data).to.have.property('uuid')
  expect(this.response.data.uuid).to.be.uuid('v1')
})

defineStep('the downloaded image matches the saved hash', function(this: CustomWorld) {
  const md5Hash = TestUtils.hashImage(Buffer.from(this.response.data))
  this.attachMD5Hash('HTTP response data', md5Hash)
  expect(md5Hash).to.equal(this.hash)
})

defineStep('the list of images is empty', function(this: CustomWorld) {
  this.attachJsonResponse(this.response)
  expect(this.response.status).to.equal(200)
  expect(this.response.data).to.be.array()
  expect(this.response.data).to.be.empty
})

defineStep('Alice has noted the UUID for the uploaded image', function(this: CustomWorld) {
  expect(this.response.status).to.equal(201)
  expect(this.response.data).to.have.property('uuid')
  expect(this.response.data.uuid).to.be.uuid('v1')
  this.uuid = this.response.data.uuid
  this.attach(`Noted UUID: ${this.uuid}`)
})

defineStep('an image with the noted UUID is in the list', function(this: CustomWorld) {
  this.attachJsonResponse(this.response)
  expect(this.response.status).to.equal(200)
  expect(this.response.data).to.be.array()
  expect(this.response.data).to.include.deep.members([{ uuid: this.uuid }])
})

defineStep('the image has a rating of {int}', function(this: CustomWorld, rating: number) {
  this.attachJsonResponse(this.response)
  expect(this.response.status).to.equal(200)
  expect(this.response.data).to.have.property('rating')
  expect(this.response.data.rating).to.deep.equal(rating)
})
