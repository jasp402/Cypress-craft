# <reference types="cypressCraft" />
# ---------------------------------------------------------------------------------------
# Welcome to CypressCraft! | Specification File Overview:
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

Feature: Login Page
  Details - Page where the users can login to their accounts

  Background:
    Given the Page Object Model configuration for "login" has been initialized
    Given el usuario ingresa a la pagina login

  Scenario: Login success
    When the user should type in the field "usernameInput" with value "standard_user"
    When the user should type in the field "passwordInput" with value "secret_sauce"
    When the user should clic in the button "loginBtn"
    Then the element "title" should "have text" "Swag Labs"
    Then the image "shoppingCart" should "is visible"
    Then the element "url" should "have url" "https://www.saucedemo.com/inventory.html"

  Scenario: Login locked
    When the user should type in the field "usernameInput" with value "locked_out_user"
    When the user should type in the field "passwordInput" with value "secret_sauce"
    When the user should clic in the button "loginBtn"
    Then the section "errorMessage" should "have text" "Epic sadface: Sorry, this user has been locked out."


  Scenario Outline: Login <title>
    When the user should type in the field "usernameInput" with value "<username>"
    When the user should type in the field "passwordInput" with value "<password>"
    When the user should clic in the button "loginBtn"
    Then the section "errorMessage" should "have text" "<errorMessage>"

    Examples:
      | title            | username      | password      | errorMessage                                                              |
      | Failure user     | test-user     | secret_sauce  | Epic sadface: Username and password do not match any user in this service |
      | Failure Password | standard_user | test-password | Epic sadface: Username and password do not match any user in this service |