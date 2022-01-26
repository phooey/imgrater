import { CustomWorld } from '../support'
import { defineStep } from '@cucumber/cucumber'
import { expect } from 'chai'

defineStep('Alice gets a bad request error saying: {string}', function(this: CustomWorld, errorMessage: string) {
  this.attachJsonResponse(this.response)
  expect(this.response.status).to.equal(400)
  expect(this.response.data).to.have.property('message')
  expect(this.response.data.message).to.equal(errorMessage)
})

defineStep('Alice gets a not found error', function(this: CustomWorld) {
  // When downloading an image the response is set to buffer
  if (Buffer.isBuffer(this.response.data)) {
    this.response.data = JSON.parse(this.response.data.toString())
  }
  this.attachJsonResponse(this.response)
  expect(this.response.status).to.equal(404)
  expect(this.response.data).to.have.property('message')
  expect(this.response.data.message).to.equal('An image with the specified UUID could not be found')
})

