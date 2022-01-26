@image-upload-download
Feature: Image upload and download

  As a user
  I want to upload and download images
  so that I can share my images with other users

  Background:
    Given Alice is a user

  @image-upload
  Scenario: Upload an image
    When Alice uploads the image "example_image.jpg"
    Then the upload finishes successfully
    And a valid UUID for the image is returned

  @error-handling
  Scenario: Upload an image that is too large
    When Alice uploads the image "large_image.jpg"
    Then Alice gets a bad request error saying: "File too large"

  @error-handling
  Scenario: Upload a non-image file
    When Alice uploads the file "not_an_image.txt"
    Then Alice gets a bad request error saying: "File is not an image"

  @image-download
  Scenario: Upload and then download an image
    Given Alice has hashed the image "example_image.jpg"
    And Alice has successfully uploaded the image "example_image.jpg"
    And Alice has noted the UUID for the uploaded image
    When Alice downloads the image with the noted UUID
    Then the image is successfully downloaded
    And the downloaded image matches the saved hash

  @error-handling
  Scenario: Download a non-existing image
    When Alice downloads the image with the UUID "incorrect"
    Then Alice gets a not found error
