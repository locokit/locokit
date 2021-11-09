# Getting started

To start LocoKit, you can use the docker-compose installation
or by cloning the repository.

## docker-compose installation

On your host, you'll have to create a `docker-compose.yml` file.

You can download it from 

You can write the following content inside  :

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

The LCK platform is compose of several packages :

* backend
  * several docker images (the API based on Feathers, the db based on PostGreSQL, ...)
* frontend
  * the generic build is archived
  * for a custom build, you'll need to enhance visuals from the build, or the theme
* client library (node + browser)
  * based on the FeathersJS client
  * includes the typings of the platform (User, Group, Permission, Workspace, ...)
  * and several methods already wired to the backend for starting more quickly
  * not available at this time

## cloning the repository (for dev)