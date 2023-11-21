# <reference types="cypressCraft" />
#
# Welcome to CypressCraft!
#
# This spec file contains a variety of sample tests
# for a todo list app that are designed to demonstrate
# the power of writing tests in Cypress-Craft.
#
# To learn more about how Cypress works and
# what makes it such an awesome testing tool,
# please read our getting started guide:
# https://on.cypress.io/introduction-to-cypress

Feature: Example test for JSONPlaceholder
  test API method from JSONPlaceholder (POST, GET, PUT, DELETE)

  Background:
    Given the Page Object Model configuration for "posts" has been initialized

  Scenario:Successful creation of a post
    When a POST request is sent to the "posts" endpoint
    When I show the "posts" endpoint request
    When I show the "posts" endpoint response
    Then the response on "posts" should have the parameter "status" with condition "is equal to" and value "201"

  Scenario: Retrieve specific post
    When a GET request is sent to the "posts" endpoint
    When I show the "posts" endpoint request
    When I show the "posts" endpoint response
    Then the response on "posts" should have the parameter "status" with condition "is equal to" and value "200"

  Scenario: Update specific post
    When a PATCH request is sent to the "posts" endpoint
      | url                                          |
      | https://jsonplaceholder.typicode.com/posts/1 |
    When I show the "posts" endpoint request
    When I show the "posts" endpoint response
    Then the response on "posts" should have the parameter "status" with condition "is equal to" and value "200"

  Scenario: Delete specific post
    When a DELETE request is sent to the "posts" endpoint
      | url                                          |
      | https://jsonplaceholder.typicode.com/posts/1 |
    When I show the "posts" endpoint request
    When I show the "posts" endpoint response
    Then the response on "posts" should have the parameter "status" with condition "is equal to" and value "200"