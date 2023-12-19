# <reference types="cypressCraft" />
# ---------------------------------------------------------------------------------------
# Welcome to Cypress-Craft! | Specification File Overview:
# ---------------------------------------------------------------------------------------
# This file contains a diverse array of sample tests utilizing the tool:
# https://jsonplaceholder.typicode.com/
#
# Purpose:
# - To emulate requests and responses to a real API.
# - Demonstrates how to make (POST), (GET), (PATCH), and (DELETE) requests
#   at a high level of abstraction.
#
# Further Information:
# - For comprehensive details, you are invited to review the cypress-craft documentation.
# ---------------------------------------------------------------------------------------
# >> Feel free to delete this message after reading the entire message <<

# language: en

Feature: Example test for JSONPlaceholder
  test API method from JSONPlaceholder on comments (POST, GET, PUT, DELETE)

  Background:
    Given the Page Object Model configuration for "comments" has been initialized

  Scenario:Successful creation of a comments
    When a POST request is sent to the "comments" endpoint
    When I show the "comments" endpoint request
    When I show the "comments" endpoint response
    Then the response on "comments" should have the parameter "status" with condition "is equal to" and value "201"
    Then the response on "comments" should have the parameter "body.id" with condition "is equal to" and value "501"

  Scenario: Retrieve specific comments
    When a GET request is sent to the "comments" endpoint
      | url                |
      | #BASE_URL#/comments/1 |
    When I show the "comments" endpoint request
    When I show the "comments" endpoint response
    Then the response on "comments" should have the parameter "status" with condition "is equal to" and value "200"
    Then the response on "comments" should have the parameter "body.postId" with condition "is equal to" and value "1"
    Then the response on "comments" should have the parameter "body.id" with condition "is equal to" and value "1"
    Then the response on "comments" should have the parameter "body.name" with condition "is equal to" and value "id labore ex et quam laborum"
    Then the response on "comments" should have the parameter "body.email" with condition "is equal to" and value "Eliseo@gardner.biz"

  Scenario: Update specific comments
    When a PATCH request is sent to the "comments" endpoint
      | url                |
      | #BASE_URL#/comments/1 |
    When I show the "comments" endpoint request
    When I show the "comments" endpoint response
    Then the response on "comments" should have the parameter "status" with condition "is equal to" and value "200"
    Then the response on "comments" should have the parameter "body.postId" with condition "is equal to" and value "1"
    Then the response on "comments" should have the parameter "body.id" with condition "is equal to" and value "1"
    Then the response on "comments" should have the parameter "body.name" with condition "is equal to" and value "id labore ex et quam laborum"
    Then the response on "comments" should have the parameter "body.email" with condition "is equal to" and value "Eliseo@gardner.biz"

  Scenario: Delete specific comments
    When a DELETE request is sent to the "comments" endpoint
      | url                |
      | #BASE_URL#/comments/1 |
    When I show the "comments" endpoint request
    When I show the "comments" endpoint response
    Then the response on "comments" should have the parameter "status" with condition "is equal to" and value "200"