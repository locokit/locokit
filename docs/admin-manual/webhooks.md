# Webhooks

LocoKit integrate a webhook mechanism.

You can configure at several level the trigger of a URL call :
* when a record is created
* when a record is updated
* when a specific column of a record is updated
* trigger manual
* CRON (not implemented)

Each call of the URL will be made with the record id in parameters.

The data itself is not sent, so if you need it,
you have to authenticate against the LocoKit platform
and retrieve all the data needed through the API.