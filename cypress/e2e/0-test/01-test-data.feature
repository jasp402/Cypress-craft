Feature: Example test for JSONPlaceholder
  test API method from JSONPlaceholder (POST, GET, PUT, DELETE)

  Background:
    Given the Page Object Model configuration for "posts" has been initialized

  Scenario:Testing the 'Create Post' Method on JSONPlaceholder's /create Endpoint
    Given a {word} request is sent to the {word} endpoint
#    Then I should get response with status code 201

