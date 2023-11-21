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

  Scenario:Testing the 'Create Post' Method on JSONPlaceholder's /create Endpoint
#    When a POST request is sent to the posts endpoint
#    When I show the "posts" endpoint request
#    When I show the "posts" endpoint response
    Then the response on "posts" should have the parameter "status" with condition "is equal to" and value "201"
#    Then the response on "posts" should have the parameter "statusText" with condition "is equal to" and value "Created"
#    Then the response on "posts" should have the parameter "body" with condition "is equal to" and value "{
#      "title": "foo",
#      "body": "bar",
#      "userId": 1
#    }"
#    Then the response on "posts" should have the parameter "headers" with condition "is equal to" and value "{
#      "content-type": "application/json; charset=utf-8",
#      "content-length": "83",
#      "connection": "close",
#      "x-powered-by": "Express",
#      "access-control-allow-origin": "*",
#      "etag": "W/\"53-2jmj7l5rSw0yVb/vlWAYkK/YBwk\"",
#      "date": "Tue, 12 May 2020 20:29:29 GMT",
#      "via": "1.1 vegur"
#    }"
#    Then the response on "posts" should have the parameter "ok" with condition "is equal to" and value "true"
#    Then the response on "posts" should have the parameter "url" with condition "is equal to" and value "https://jsonplaceholder.typicode.com/posts"
#    Then the response on "posts" should have the parameter "redirected" with condition "is equal to" and value "false"
#    Then the response on "posts" should have the parameter "status" with condition "is equal to" and value "201"
#    Then the response on "posts" should have the parameter "statusText" with condition "is equal to" and value "Created"
#    Then the response on "posts" should have the parameter "body" with condition "is equal to" and value "{
#      "title": "foo",
#      "body": "bar",
#      "userId": 1,
#      "id": 101
#    }"
#    Then the response on "posts" should have the parameter "headers" with condition "is equal to" and value "{
#      "content-type": "application/json; charset=utf-8",
#      "content-length": "83",
#      "connection": "close",
#      "x-powered-by": "Express",
#      "access-control-allow-origin": "*",
#      "etag": "W
