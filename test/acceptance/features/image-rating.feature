@image-rating
Feature: Image rating

  As a user I want to rate and see the rating of uploaded images
  so that I can share my opinion and know which images are popular

  Background:
    Given Alice is a user

  @error-handling
  Scenario: Retrieve the rating of a non-existing image
    When Alice retrieves the rating for the image with the UUID "non-existing"
    Then Alice gets a not found error

  @error-handling
  Scenario Outline: Rating a non-existing image
    When Alice rates the image with the UUID "non-existing" <direction>
    Then Alice gets a not found error
    Examples:
      | direction |
      | up        |
      | down      |

  Scenario: Retrieve the rating after succesfully uploading an image
    Given Alice has successfully uploaded the image "example_image.jpg"
    And Alice has noted the UUID for the uploaded image
    When Alice retrieves the rating for the image with the noted UUID
    And the image has a rating of 0

  @error-handling
  Scenario Outline: Rating a succesfully uploaded image in an invalid direction
    Given Alice has successfully uploaded the image "example_image.jpg"
    And Alice has noted the UUID for the uploaded image
    When Alice tries to rate the image with the noted UUID with an invalid direction
    Then Alice gets a bad request error saying: "Invalid rating direction"

  Scenario Outline: Retrieve the rating after succesfully uploading and rating an image
    Given Alice has successfully uploaded the image "example_image.jpg"
    And Alice has noted the UUID for the uploaded image
    And Alice has successfully rated the image with the noted UUID <direction>
    When Alice retrieves the rating for the image with the noted UUID
    And the image has a rating of <value>
    Examples:
      | direction | value |
      | up        | 1     |
      | down      | -1    |
