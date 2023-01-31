# webapp

Developer - SaiMahith Chigurupati </br>
NUID - 002700539 </br>
Email - chigurupati.sa@northeastern.edu

Tools required to run the project : 

- IDE like Visual Studio Code || IntelliJ 
- Postman (for sending requests and receiving response)

## Instructions to run the Project:

- npm i --save (to install dependencies)
- npm start (to start the server)
- npm test (to run the test cases)

## Endpoint URLs
//Get user Account Information </br>
GET /v1/user/{userId}

//Update User's Account Information </br>
PUT /v1/user/{userId}

//Health EndPoint </br>
GET /healthz

//Create a User Account </br>
POST /v1/user

## Sample JSON Request for POST

{ </br>
  "first_name": "Jane",</br>
  "last_name": "Doe",</br>
  "username": "jane.doe@example.com",</br>
  "password": "password"</br>
}


## Sample JSON Response for GET
{</br>
  "id": 1,</br>
  "first_name": "Jane",</br>
  "last_name": "Doe",</br>
  "username": "jane.doe@example.com",</br>
  "account_created": "2016-08-29T09:12:33.001Z",</br>
  "account_updated": "2016-08-29T09:12:33.001Z"</br>
}



