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

# language: es

Característica: Login Page
  Details - Page where the users can login to their accounts

  Antecedentes:
    Dado la configuración del POM ha sido inicializada para "login"
    Dado el usuario ingresa a la pagina login

  Escenario: Login success
    Cuando el usuario escribe en el campo "usernameInput" con el valor "standard_user"
    Cuando el usuario escribe en el campo "passwordInput" con el valor "secret_sauce"
    Cuando el usuario hace clic en el botón "loginBtn"
    Entonces el elemento "title" debe "tiene el texto" "Swag Labs"
    Entonces la imagen "shoppingCart" debe "ser visible"
    Entonces el elemento "url" debe "tener la ruta" "https://www.saucedemo.com/inventory.html"

  Escenario: Login locked
    Cuando el usuario escribe en el campo "usernameInput" con el valor "locked_out_user"
    Cuando el usuario escribe en el campo "passwordInput" con el valor "secret_sauce"
    Cuando el usuario hace clic en el botón "loginBtn"
    Entonces la sección "errorMessage" debe "tiene el texto" "Epic sadface: Sorry, this user has been locked out."

  Esquema del escenario: Login <title>
    Cuando el usuario escribe en el campo "usernameInput" con el valor "<username>"
    Cuando el usuario escribe en el campo "passwordInput" con el valor "<password>"
    Cuando el usuario hace clic en el botón "loginBtn"
    Entonces la sección "errorMessage" debe "tiene el texto" "<errorMessage>"

    Ejemplos:
      | title            | username      | password      | errorMessage                                                              |
      | Failure user     | test-user     | secret_sauce  | Epic sadface: Username and password do not match any user in this service |
      | Failure Password | standard_user | test-password | Epic sadface: Username and password do not match any user in this service |