# Processes / Workflows

You can manage some logical workflows in LocoKit,
with a webhook mechanism.

You can configure at several level the trigger of a URL call :
* when a record is created
* when a record is updated
* when a specific column of a record is updated
* trigger manual

Each call of the URL will be made with the record id in parameters.

## What is sent to the webhook


```json
{
  "table_row_id": "uuid-of-the-locokit-row",
  "user_id": 12, // id of the user that trigger this workflow
  "process_id": "uuid-of-the-locokit-process-trigerred"
}
```

The data itself is not sent, so if you need it,
you have to authenticate against the LocoKit platform
and retrieve all the data needed through the API.

## What is expected by LocoKit in return

In result of the process execution,
LocoKit is able to store and display some data to the end user.

LocoKit will store each process execution as a "run".

Workspace's manager can read these runs through the process listing 
or via the detail record view, in the process panel.

LocoKit is analyzing return and expect this type of object :

```json
{
  "code": 200, // when it's ok, or any HTTP valid code
  "message": "A message that could be displayed to the end user" // in the success / error modal
}
```

