---
sidebar: true
sidebarDepth: 2
---

# Key features

LocoKit use several notions, this section will explain them.

## Workspace

The workspace is the repository of your data,
your application and all that is related :
groups, users, permissions, and also workflows.

When you access to a LocoKit instance, as a user, 
you will access to workspaces other users create or you have created.

In your workspaces, you'll be able to manage your data,
and configure an application dedicated to your users.

In workspaces you have access, according to your permissions,
you'll be able to access data, create or update it, manage it,
or even configure the dedicated application of this workspace.

## Database

A workspace can have one (and soon several) database.

Each database will be defined with a **schema**.
A specific UI will allow you define your database **tables**,
each table will be composed of fields and records.

A **field** is like a table column.
You create one field, set its type, maybe a default value
or a formula, and that's it.

A **record** is a set of values, for the related table.
Think of a line in a spreadsheet, or a row in a database.

**Relations** can be defined between tables,
allowing records to be linked.

A spreadsheet-like UI is available for editing your data.

You can define also **views** of your data,
by selecting fields and by applying filters on it.

## Authentication / Permissions

A workspace can be available for users, or groups of users.

A dedicated section is available in the workspace manager interface,
allowing workspace managers to configure what's authorized
for groups. Create, Read, Update or Delete on tables.

You can also define specific filters on the tables
to define exactly what can be read / updated / deleted.
In this advanced use case, you'll have to write JSON code.

## Workflows

When data is created / updated / removed,
workflows can be triggered.

A workflow is an external program,
callable from the LocoKit platform with a webhook,
through a HTTP GET or POST.

This allows you to call webhooks for example,
to react to data updates.

## Files / S3

The LocoKit platform is able to manage files, 
in a classic file system, or a S3-like system.

## Application / App builder

You can create your application thanks to our app builder.

With the configuration of permissions,
you can create **chapters** dedicated to a group of users.

Each chapter will be composed of **pages**,
displaying data accordingly to the logged user.

This data will come from the **views** 
you will display through [**blocks**](./block-types).
