# Environment variables

The backend use some environment variables
for configuring some part of it.

Here is a summary.

## Web server

```yml
# Port on which LocoKit will listen
LCK_PORT=3030
# Hostname on which LocoKit is
LCK_HOST=localhost
# Public URL users will have to call the server (API mainly)
# Useful for link in emails for example
LCK_PUBLIC_URL=http://localhost:8080
# What is the name of this LocoKit instance
# Useful for email subjects
LCK_PUBLIC_PORTAL_NAME=Locokit
# Secret used to encrypt user passwords
LCK_AUTH_SECRET=yoursecretforpasswordTOCHANGEABSOLUTELY
# URL connection to the database
LCK_DATABASE_URL=postgres://postgres:pouicpouic@localhost:5432/postgres
# [dev] URL connection to the database, only for dev/test purpose
LCK_DATABASE_URL_TEST=postgres://postgres:pouicpouic@localhost:5433/postgres
# [dev] Allow developer to see all requests executed in the terminal
OBJECTION_DEBUG=false
```

## Mail server

You can connect LocoKit platform
to a mail server for sending emails
concerning signups, lost passwords, ...

In the default docker-compose, 
a [mailhog](https://github.com/mailhog/MailHog) container
is created, allowing you to check emails.

```yml
MAIL_PORT=1025
MAIL_SERVER=localhost
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_DEFAULT_FROM="Contact locokit" <contact@locokit.io>
MAIL_SECURE=false
```

## Sentry

Check [Sentry documentation](https://docs.sentry.io/platforms/node/configuration/options/).

```yml
SENTRY_DSN=
SENTRY_RELEASE=
SENTRY_ENVIRONMENT=
```

## Security

```
CORS_ORIGIN=*

# Helmet settings
# https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
HELMET_HSTS=true

# Signup keys
# Is the signup allowed on the LocoKit platform
# This will display a signup form in the front,
# and the signup endpoint will be registered
SIGNUP_ALLOWED=false
# How many tries are authorized
SIGNUP_RATE_LIMIT_MAX=5
# Within a time frame of xxx milliseconds
# If more than 5 signup during 60s
# signups will be rejected with a 429 HTTP (TooManyRequests)
SIGNUP_RATE_LIMIT_TIMEFRAME=60000
```

## Storage keys

```
# type can be one of : s3 (s3 compatible object storage), fs (file system)
STORAGE_TYPE=s3
# public path can be one of : /s3-storage (s3 compatible object storage), /fs-storage (file system)
# these paths depend on your configuration (nginx or other)
STORAGE_PUBLIC_PATH=/s3-storage
STORAGE_S3_URL=http://localhost:9000
STORAGE_S3_ACCESS_KEY=minio
STORAGE_S3_SECRET_KEY=notsecret
STORAGE_S3_PATH_STYLE=1
STORAGE_S3_SIGNATURE_VERSION=v4
STORAGE_S3_DEFAULT_BUCKET=public
STORAGE_FS_PATH=../fs-storage
STORAGE_MAX_UPLOAD_SIZE=20mb
```
# Public URL

For user management purpose, 
you'll have to set the `LCK_PUBLIC_URL` to the public url of the front-end.

This will help users to verify their email during the signup process,
or password reset.