Feature: Login Page
  Details - Page where the users can login to their accounts

  Background:
    Given the Page Object Model configuration for "login" has been initialized
    Given el usuario ingresa a la pagina login

  Scenario: Login success
    When el usuario escribe en el campo "usernameInput" con el valor "standard_user"
    When el usuario escribe en el campo "passwordInput" con el valor "secret_sauce"
    When el usuario hace clic en el botón "loginBtn"
    Then el elemento "title" debe "tiene el texto" "Swag Labs"
    Then la imagen "shoppingCart" debe "ser visible"
    Then el elemento "url" debe "tener la ruta" "https://www.saucedemo.com/inventory.html"


  Scenario: Login locked
    When el usuario escribe en el campo "usernameInput" con el valor "locked_out_user"
    When el usuario escribe en el campo "passwordInput" con el valor "secret_sauce"
    When el usuario hace clic en el botón "loginBtn"
    Then la sección "errorMessage" debe "tiene el texto" "Epic sadface: Sorry, this user has been locked out."



  Scenario Outline: Login <title>
    When el usuario escribe en el campo "usernameInput" con el valor "<username>"
    When el usuario escribe en el campo "passwordInput" con el valor "<password>"
    When el usuario hace clic en el botón "loginBtn"
    Then la sección "errorMessage" debe "tiene el texto" "<errorMessage>"

    Examples:
      | title            | username      | password      | errorMessage                                                              |
      | Failure user     | test-user     | secret_sauce  | Epic sadface: Username and password do not match any user in this service |
      | Failure Password | standard_user | test-password | Epic sadface: Username and password do not match any user in this service |