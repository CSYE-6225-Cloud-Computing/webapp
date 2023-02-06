# webapp

## CSYE 6225: Network Structures and Cloud Computing

Milestone: Assignment 02 </br>
Developer - SaiMahith Chigurupati </br>
NUID - 002700539 </br>
Email - chigurupati.sa@northeastern.edu

Tools required to run the project : 

- IDE like Visual Studio Code || IntelliJ 
- Postman (for sending requests and receiving response)
- pgAdmin (optional)

## Instructions to run the Project:
``` JavaScript
//to install dependencies
npm i --save 

//to start the server
npm start 

//to run the test cases
npm test 
```

## Endpoint URLs for User Schema

<a href = "https://app.swaggerhub.com/apis-docs/csye6225-webapp/cloud-native-webapp/spring2023-a1">Swagger v01</a>

``` JavaScript
//Get user Account Information 
GET /v1/user/{userId}

//Update User's Account Information 
PUT /v1/user/{userId}

//Health EndPoint 
GET /healthz

//Create a User Account 
POST /v1/user
```

## Sample JSON Request for POST Method

```JSON
{ 
  "first_name": "Jane",
  "last_name": "Doe",
  "username": "jane.doe@example.com",
  "password": "password"
}
```


## Sample JSON Response for GET Method

``` JSON
{
  "id": 1,
  "first_name": "Jane",
  "last_name": "Doe",
  "username": "jane.doe@example.com",
  "account_created": "2016-08-29T09:12:33.001Z",
  "account_updated": "2016-08-29T09:12:33.001Z"
}
```

## Endpoint URLs for Products Schema

<a href = "https://app.swaggerhub.com/apis-docs/csye6225-webapp/cloud-native-webapp/spring2023-a2#/authenticated/put_v1_product__productId_">Swagger v02</a>

``` JavaScript

//POST Method URL for products
/v1/product

//GET Method URL for products
/v1/product/{product Id}

//PUT Method URL for products
/v1/product/{product Id}

//PUT Method URL for products
/v1/product/{product Id}

//DELETE Method URL for products
/v1/product/{product Id}

```

## Sample JSON Request for POST Method
``` JSON
{
  "name": "test",
  "description": "test",
  "sku": "test",
  "manufacturer": "test",
  "quantity": 1
}
```

## Sample JSON Response for GET Method
``` JSON
{
    "id": 1,
    "name": "test",
    "description": "test",
    "sku": "test",
    "manufacturer": "test",
    "quantity": 1,
    "date_added": "2023-02-06T04:45:26.147Z",
    "date_last_updated": "2023-02-06T04:45:26.147Z",
    "owner_user_id": 1
}
```



