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

#  Scenario: Login success
#    When A user enters the username "standard_user"
#    And A user enters the password "secret_sauce"
#    And A user clicks on the login button
#    Then A user will be logged in
#
#  Scenario: Locked out User
#    When A user enters the username "locked_out_user"
#    And A user enters the password "secret_sauce"
#    And A user clicks on the login button
#    Then The error message "Epic sadface: Sorry, this user has been locked out." is displayed
#
#  Scenario: Failure User Login
#    When A user enters incorrect credentials
#      | username  | password     |
#      | test-user | secret-sauce |
#    And A user clicks on the login button
#    Then The error message "Epic sadface: Username and password do not match any user in this service" is displayed
#
#  Scenario: Failure Password Login
#    When A user enters incorrect credentials
#      | username  | password     |
#      | standard_user | test-password |
#    And A user clicks on the login button
#    Then The error message "Epic sadface: Username and password do not match any user in this service" is displayed