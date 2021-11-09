# Getting started

To start LocoKit, you can use the docker-compose installation
or by cloning the repository.

## docker-compose installation

On your host, you'll have to create a `docker-compose.yml` file.

You can download it from 
https://raw.githubusercontent.com/locokit/locokit/master/docker-compose-starter.yml
directly if you want.

```yaml
# This docker-compose is for testing purpose only
# For a deployment, you'll need to set a mail server
# and security with helmet environment variables,
# maybe a nginx for serving front and reverse proxy to the api and the file storage.
version: '3'
services:
  lck-db:
    image: postgis/postgis:12-3.0
    environment:
      POSTGRES_DB: public
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: pouicpouic
    # restart: always
    volumes:
      - lck-db-data:/var/lib/postgresql/data
      - ./dumps:/dumps
    container_name: lck-db

  lck-mail:
    image: mailhog/mailhog:latest
    environment:
      MH_STORAGE: maildir
      MH_MAILDIR_PATH: /home/mailhog
    volumes:
      - mailhog:/home/mailhog/
    ports:
      # - 1025:1025
      - 8025:8025
    container_name: lck-mail

  lck-platform:
    image: locokit/locokit:0.6.0
    environment:
      LCK_PORT: "8002"
      LCK_HOST: localhost
      LCK_PUBLIC_URL: http://localhost:8002
      LCK_PUBLIC_PORTAL_NAME: Locokit
      LCK_AUTH_SECRET: putYourAuthSecretHereAndChangeItPlease!
      LCK_DATABASE_URL: postgres://postgres:pouicpouic@lck-db:5432/public
      OBJECTION_DEBUG: "false"

      MAIL_PORT: "1025"
      MAIL_SERVER: lck-mail
      MAIL_DEFAULT_FROM: contact@locokit.io
      MAIL_SECURE: "false"

      CORS_ORIGIN: "*"

      # Signup keys
      # Is the signup allowed on the LocoKit platform
      # This will display a signup form in the front,
      # and the signup endpoint will be registered
      SIGNUP_ALLOWED: "true"
      # How many tries are authorized
      SIGNUP_RATE_LIMIT_MAX: "5"
      # Within a time frame of xxx milliseconds
      # If more than 5 signup during 60s
      # signups will be rejected with a 429 HTTP (TooManyRequests)
      SIGNUP_RATE_LIMIT_TIMEFRAME: "60000"

      HELMET_ENABLED: "false"
      HELMET_HSTS: "false"

      # Storage keys
      # type can be one of : s3 (s3 compatible object storage), fs (file system)
      STORAGE_TYPE: fs
      # public path can be one of : /s3-storage (s3 compatible object storage), /fs-storage (file system)
      # these paths depend on your configuration (nginx or other)
      STORAGE_PUBLIC_PATH: /fs-storage
      STORAGE_FS_PATH: ./fs-storage
      STORAGE_MAX_UPLOAD_SIZE: 20mb
    ports:
      - "8002:8002"
    depends_on:
      - lck-mail
    container_name: lck-platform
    volumes:
      - lck-fs-storage:/code/fs-storage/

volumes:
  lck-db-data:
  mailhog:
  lck-fs-storage:
```

Then, you can launch docker-compose :

```sh
docker-compose up
```

You'll see 3 containers starting.

The `lck-platform` container will start by playing database migrations,
so your database will be up to date.

At this stage, no user have been created.

If you want to create the superadmin user,
you can run this command in another terminal :

```sh
docker exec lck-platform npm run seed:run
```

This will create a new `SUPERADMIN` user with the following credentials :

```
email: superadmin@locokit.io
password: locokit
```

For more details on environment variables,
check the [dedicated page](advanced/env-vars.html).

## cloning the repository (for dev)

The other way to start the LocoKit platform is by cloning the repo 
available in [https://github.com/locokit/locokit](https://github.com/locokit/locokit).

Please follow instructions that are available directly in the README of the repo.
