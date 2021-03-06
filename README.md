## Description

[![pipeline status](https://gitlab.com/fuzzymatter/hush-api/badges/master/pipeline.svg)](https://gitlab.com/fuzzymatter/hush-api/commits/master)

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

Visit `https://host:port/api` for Swagger docs.
