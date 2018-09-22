## Description

Hush service api project.

## Development

Copy `.sample.env` to `.env`.

This project uses Postgres and pgAdmin4. To start them run:

```
$ docker-compose up -d
```

This will launch containers in the background.

To access pgAdmin4 visit `http://localhost:5050`. To login use:

- email: `pgadmin4@pgadmin.org`
- password: `admin`

When adding the local server for the first time use:

- connection: `postgres`
- user: `postgres`
- password: `postgres`

To create the application databases run `yarn scripts:db:init`.

## Routes

`POST /signups` - Create new signup

Expires in 5 minutes.

Request body

```javascript
{
  email: string,
  name: string,
}
```

Responses include:

- `400 BadRequest`
- `409 Conflict` if active signup for `email` exists
- `201` if successful

`POST /verified-signups` - Complete sign up with verification code

```javascript
{
  signupId: string,
  code: string,
  publicKey: string,
  privateKey: string,
}
```

Responses include:

- `400 BadRequest`
- `404 NotFound`
- `409 Conflict` if signup is already verified
- `201` if successful
