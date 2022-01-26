@image-list
Feature: Image list

  As a user I want to retrieve a list of uploaded images
  so that I know which images I can download

  Background:
    Given Alice is a user

  Scenario: List images with no uploaded images
    When Alice retrieves the list of images
    Then the list of images is empty

  Scenario: List images after failing to upload an image
    Given Alice has unsuccessfully tried to uploaded the image "large_image.jpg"
    When Alice retrieves the list of images
    Then the list of images is empty

  Scenario: List images after succesfully uploading an image
    Given Alice has successfully uploaded the image "example_image.jpg"
    And Alice has noted the UUID for the uploaded image
    When Alice retrieves the list of images
    Then an image with the noted UUID is in the list
