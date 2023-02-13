# User and Quote RESTful API
##  Introduction
This is a RESTful API for managing users and quotes. It allows for the creation, reading, updating, and deletion of users and quotes.

## Endpoints
The following endpoints are available:

* POST `/signin`: Creates a new user.
* POST `/signin`: Signs in an existing user and receives a token.
* GET `/users`: Retrieve a list of all users.
* GET `/users/:id`: Retrieve a specific user by ID.
* POST `/users`: Create a new user.
* PUT `/users/:id`: Update an existing user by ID.
* DELETE `/users/:id`: Delete a user by ID.
* GET `/quotes`: Retrieve a list of all quotes.
* GET `/quotes/:id`: Retrieve a specific quote by ID.
* POST `/quotes`: Create a new quote.
* PUT `/quotes/:id`: Update an existing quote by ID.
* DELETE `/quotes/:id`: Delete a quote by ID.

## Request and Response Formats
### Request Body
All endpoints that create or update a resource accept a JSON object in the request body. The specific properties for each resource are outlined below:
#### SignIn
```
{
  "name": "user",
  "email": "user@gmail.com",
  "password": "password",
  "confirmPassword": "password"
}
```
#### SignUp
```
{
  "email": "user@gmail.com",
  "password": "password"
}
```
#### Creating a new quote, the author will be always the user creating
```
{
  "quote": "Example of a quote"
}
```
### Resonse Body

All endpoints return a JSON object in the response body. The specific properties for each resource are outlined below:
#### Genaral good response,
```
{
  message: "Action conclude",
}
#### Genaral bad response,
```
{
  message: "Action not conclude",
  error: err
}
#### SignUp
```
{
  id,
  name,
  email,
  admin,
  iat,
  eat,
  token,
}
```
#### Get all quotes
```
[
  {
      "id": 5,
      "user_id": 2,
      "quote": "Example of a quote",
      "updated_at": "2023-02-13T23:50:31.000Z",
      "author": "johnatas"
  },
]
```

## Requirements
To use this API, you will need to have the following installed:
* Node.js
* NPM
* PostgreSQL
## How to use
1. Clone the repository
``git clone https://github.com/sjohnatas7/api-quotes.git``
2. Install the dependencies
``npm install``
3. Updates the ``env_file`` to ``.env`` with your auth secret and your connection to database
4. Start the server
``npm start``
5. Use a tool like Postman to test the endpoints
6. Create a new user through ``/signup`` and login in ``/signin``
7. Set the bearer token
8. Enjoy

## Contribution
Feel free to contribute to this project by submitting issues or creating pull requests.
