## ⚒ How to Install

```bash
$ npm i
```
## Configuration

Before starting the project, make sure to set up your database credentials in the `.env.development.local` file. This file is used for local development and should not be committed to version control. Here's an example of how the `.env.development.local` file should be structured:
### Database Configuration
- **DB_HOST=** 127.0.0.1
- **DB_PORT=** 27017
- **DB_DATABASE=** crash-game
- **LOG_FORMAT=** dev
- **LOG_DIR=** ../logs

Do the same for the testing in the file `.env.test.local`

## Setup
You need [MongoDB](https://www.mongodb.com/) installed or [Docker](https://www.docker.com/)

## Commands

### To run Docker
```bash
$ docker compose up -d
```

### For Development
```bash
$ npm run dev
```

### For testing
```bash
$ npm run test
```
 
## Swagger

To use api with Swagger go to [Swagger Local route](http://localhost:3000/api-docs)

## Folder structure

| Name            | Description                                                       |
|:----------------|:------------------------------------------------------------------|
| src/config      | Global configuration that parses .env files                       |
| src/controllers | Controller functions that will handle route request               |
| src/databases   | Functionality to connect to the database                          |
| src/dto         | Data transfer objects - request/response bodies                   |
| src/exceptions  | Error classes that extends existing Error class and adds messages |
| src/game        | All game logic                                                    |
| src/interfaces  | Game interfaces/types                                             |
| src/logs        | Winston logger logs                                               |
| src/middlewares | Express API middlewares                                           |
| src/models      | Database collection models                                        |
| src/routes      | Game API routes                                                   |
| src/services    | Main stateless functionality that works with Controllers          |
| src/utils       | Various utility and helper functions                              |
| src/validators  | Functions to validate API requests                                |