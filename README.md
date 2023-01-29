# webapp

//Get user Account Information
GET /v1/user/{userId}

//Update User's Account Information
PUT /v1/user/{userId}

//Health EndPoint
GET /healthz

// Create a User Account
POST /v1/user

//sample JSON Schema
User{
    id	integer($int64)
    example: 1
    readOnly: true
    first_name*	string
    example: Jane
    last_name*	string
    example: Doe
    password*	string($password)
    example: somepassword
    writeOnly: true
    username*	string($email)
    example: jane.doe@example.com
    account_created	string($date-time)
    example: 2016-08-29T09:12:33.001Z
    readOnly: true
    account_updated	string($date-time)
    example: 2016-08-29T09:12:33.001Z
    readOnly: true
}

//Sample JSON
{
  "id": 1,
  "first_name": "Jane",
  "last_name": "Doe",
  "username": "jane.doe@example.com",
  "account_created": "2016-08-29T09:12:33.001Z",
  "account_updated": "2016-08-29T09:12:33.001Z"
}