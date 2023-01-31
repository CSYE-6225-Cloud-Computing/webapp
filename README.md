# webapp

Developer - SaiMahith Chigurupati
NUID - 002700539
Email - chigurupati.sa@northeastern.edu

Tools required to run the project :

- IDE like Visual Studio Code || IntelliJ 
- Postman //for sending requests and receiving response

## Instructions to run the Project:

- npm i --save //to install dependencies
- npm start // to start the server
- npm test // to run the test cases

## Endpoint URLs
//Get user Account Information
GET /v1/user/{userId}

//Update User's Account Information
PUT /v1/user/{userId}

//Health EndPoint
GET /healthz

// Create a User Account
POST /v1/user

## Sample JSON Request for POST

{
  "first_name": "Jane",
  "last_name": "Doe",
  "username": "jane.doe@example.com",
  "password": "password"
}


## Sample JSON Response for GET
{
  "id": 1,
  "first_name": "Jane",
  "last_name": "Doe",
  "username": "jane.doe@example.com",
  "account_created": "2016-08-29T09:12:33.001Z",
  "account_updated": "2016-08-29T09:12:33.001Z"
}



