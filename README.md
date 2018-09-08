## Description

Hush service api project.

## Development

This project uses Postgres and pgAdmin4. To start them run:

```
$ docker-compose up -d
```

This will launch containers in the background.

To access pgAdmin4 visit `http://localhost:5050`. To login use:

- email: `pgadmin4@pgadmin.org`
- password: `admin`.

When adding the local server for the first time use:

- connection: `postgres`
- user: `postgres`
- password: `postgres`

You should also create a new database called `hush`. This is the default database used.
