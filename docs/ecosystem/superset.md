# SuperSet

[SuperSet](https://superset.apache.org/) is an open source dataviz tool.

You can create charts, dashboards, or simply make SQL requests on your database.

You can combine SuperSet with LocoKit to have dedicated dashboards of your data.

## Installation

Please refer yourself to the SuperSet documentation,
eg. the [`docker-compose` part](https://superset.apache.org/docs/installation/docker-compose).

## Connect to the LocoKit DB

LocoKit is storing its data in a PostGreSQL with PostGIS database.

This feature is only for LocoKit instance administrator,
as you should know credentials to access the LocoKit database.

From the SuperSet tool, you can create a database
by specifying host, port, db, user & password.

![Database form creation for SuperSet](image.png)

To make the LocoKit database available for SuperSet,
you can bind the `5432` to a local port available.

For the db name, there is two way to retrieve data from LocoKit.

**`JSONB` data**

The first way is to make SQL requests on the `public.table_row` table.

You will find all data from all tables store in this table, in `JSONB` format.

In this use case, please set the db name to `public` when you configure the db connection in SuperSet.

**dedicated schema**

Each LocoKit workspace is able to generate automatically a dedicated schema
in classic flatten views.
You can check the name of your dedicated schema in the settings of your workspace,
at the `slug` field level.

Each workspace's table deserialise the `JSONB` data
in a classical column view, easier for reading / filtering purpose.

By connecting SuperSet to this dedicated schema,
you will find all your tables as views, and you'll be able to make your request
against them.

In this use case, please set the db name to the slug of your workspace
when you configure the db connection in SuperSet.