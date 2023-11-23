# <reference types="cypressCraft" />
#
# Welcome to CypressCraft!
#
# This spec file contains a variety of sample tests


Feature: Example test for JSONPlaceholder
  test API method from JSONPlaceholder (POST, GET, PUT, DELETE)

  Background:
    Given the Page Object Model configuration for "posts" has been initialized

  Scenario:Successful creation of a post
    When a POST request is sent to the "posts" endpoint
    When I show the "posts" endpoint request
    When I show the "posts" endpoint response
    Then the response on "posts" should have the parameter "status" with condition "is equal to" and value "201"
    Then the response on "posts" should have the parameter "body.id" with condition "is equal to" and value "101"

  Scenario: Retrieve specific post
    When a GET request is sent to the "posts" endpoint
      | url                |
      | #BASE_URL#/posts/1 |
    When I show the "posts" endpoint request
    When I show the "posts" endpoint response
    Then the response on "posts" should have the parameter "status" with condition "is equal to" and value "200"
    Then the response on "posts" should have the parameter "body.userId" with condition "is equal to" and value "1"
    Then the response on "posts" should have the parameter "body.id" with condition "is equal to" and value "1"
    Then the response on "posts" should have the parameter "body.title" with condition "is equal to" and value "sunt aut facere repellat provident occaecati excepturi optio reprehenderit"

  Scenario: Update specific post
    When a PATCH request is sent to the "posts" endpoint
      | url                |
      | #BASE_URL#/posts/1 |
    When I show the "posts" endpoint request
    When I show the "posts" endpoint response
    Then the response on "posts" should have the parameter "status" with condition "is equal to" and value "200"
    Then the response on "posts" should have the parameter "body.id" with condition "is equal to" and value "1"
    Then the response on "posts" should have the parameter "body.title" with condition "is equal to" and value "sunt aut facere repellat provident occaecati excepturi optio reprehenderit"


  Scenario: Delete specific post
    When a DELETE request is sent to the "posts" endpoint
      | url                |
      | #BASE_URL#/posts/1 |
    When I show the "posts" endpoint request
    When I show the "posts" endpoint response
    Then the response on "posts" should have the parameter "status" with condition "is equal to" and value "200"
