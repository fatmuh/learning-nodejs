# User API Spec

## Register User API

Endpoint : POST /api/users

Request Body:

```json
{
  "username": "fatmuh",
  "password": "admin",
  "name": "Fathur Muhammad"
}
```

Response Body Success :

```json
{
  "data": {
    "username": "fatmuh",
    "name": "Fathur Muhammad"
  }
}
```

Response Body Error :
```json
{
  "errors": "Username already registered"
}
```

## Login User API

Endpoint : POST /api/users/login

Request Body :

```json
{
  "username": "fatmuh",
  "password": "admin"
}
```

Response Body Success :

```json
{
  "data": {
    "token": "unique-token"
  }
}
```

Response Body Error :

```json
{
  "errors": "Username or password wrong"
}
```

## Update User API

Endpoint : PATCH /api/users/current

Headers :
- Authorization : token

Request Body :

```json
{
  "name": "Muhammad Fathurahman", // optional
  "password": "new password" // optional
}
```

Response Body Success :

```json
{
  "data": {
    "username": "fatmuh",
    "name": "Muhammad Fathurahman"
  }
}
```

Response Body Error :

```json
{
  "errors": "Name length max 100"
}
```

## Get User API

Endpoint : GET /api/users/current

Headers :
- Authorization : token

Response Body Success :

```json
{
  "data": {
    "username": "fatmuh",
    "name": "Muhammad Fathurahman"
  }
}
```

Response Body Error :

```json
{
  "errors": "Unauthorized"
}
```

## Logout User API

Endpoint : DELETE /api/users/logout


Response Body Success :

```json
{
  "data": "OK"
}
```

Response Body Error :

```json
{
  "errors": "Unauthorized"
}
```