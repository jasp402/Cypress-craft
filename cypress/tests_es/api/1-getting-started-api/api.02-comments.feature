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

Característica: Prueba de ejemplo usando JSONPlaceholder
  Pruebas de los métodos (POST, GET, PUT, DELETE) para el EndPoint "COMMENTS" del API JSONPlaceholder

  Antecedentes:
    Dado la configuración del POM ha sido inicializada para "comments"

  Escenario: Creación de COMMENTS exitosamente
    Cuando una petición POST es enviada al endpoint "comments"
    Cuando se muestre la petición de "comments"
    Cuando se muestre la respuesta de "comments"
    Entonces la respuesta en "comments" debe tener el parámetro "status" con la condición "es igual a" y el valor "201"
    Entonces la respuesta en "comments" debe tener el parámetro "body.id" con la condición "es igual a" y el valor "501"

  Escenario: Obtener un COMMENTS especifico
    Cuando una petición GET es enviada al endpoint "posts"
      | url                |
      | #BASE_URL#/comments/1 |
    Cuando se muestre la petición de "comments"
    Cuando se muestre la respuesta de "comments"
    Entonces la respuesta en "comments" debe tener el parámetro "status" con la condición "es igual a" y el valor "200"
    Entonces la respuesta en "comments" debe tener el parámetro "body.userId" con la condición "es igual a" y el valor "1"
    Entonces la respuesta en "comments" debe tener el parámetro "body.id" con la condición "es igual a" y el valor "1"
    Entonces la respuesta en "comments" debe tener el parámetro "body.name" con la condición "es igual a" y el valor "id labore ex et quam laborum"
    Entonces la respuesta en "comments" debe tener el parámetro "body.email" con la condición "es igual a" y el valor "Eliseo@gardner.biz"

  Escenario: Actualizar un COMMENTS especifico
    Cuando una petición PATCH es enviada al endpoint "comments"
      | url                |
      | #BASE_URL#/comments/1 |
    Cuando se muestre la petición de "comments"
    Cuando se muestre la respuesta de "comments"
    Entonces la respuesta en "comments" debe tener el parámetro "status" con la condición "es igual a" y el valor "200"
    Entonces la respuesta en "comments" debe tener el parámetro "body.postId" con la condición "es igual a" y el valor "1"
    Entonces la respuesta en "comments" debe tener el parámetro "body.id" con la condición "es igual a" y el valor "1"
    Entonces la respuesta en "comments" debe tener el parámetro "body.name" con la condición "es igual a" y el valor "id labore ex et quam laborum"
    Entonces la respuesta en "comments" debe tener el parámetro "body.email" con la condición "es igual a" y el valor "Eliseo@gardner.biz"

  Escenario: Eliminar un COMMENTS especifico
    Cuando una petición DELETE es enviada al endpoint "comments"
      | url                |
      | #BASE_URL#/comments/1 |
    Cuando se muestre la petición de "comments"
    Cuando se muestre la respuesta de "comments"
    Entonces la respuesta en "comments" debe tener el parámetro "status" con la condición "es igual a" y el valor "200"