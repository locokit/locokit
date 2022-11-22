# Database architecture

This document try to specify how the database will be structured.

LocoKit have a dedicated database, named `locokit`.

We use PostGreSQL + PostGIS extension.

## Schemas

The `locokit` database is divided into several schemas.

The main schema is `core`.

And each `workspace` will have its own schema.

### Core schema

This schema contains several tables :
* `user`: all users
* `workspace`: all workspaces created
* `role`: related to a `workspace`, is a set of permission
* `group`: related to a `workspace` and a `role`, is a set of users
* `userGroup`: the association table between `user` and `group`
* `settings`: settings of LocoKit instance

###

Each workspace will have its own schema.

TO TEST : if a table inherit from another,
when the first table is extended through a migration,
does the second see the new columns ?

## Workspace databases

Each datasource managed by LocoKit (so, for any new datasource not wired to an actual database)
will have its own database with three dedicated roles :
* `lck_{workspaceSlug}_readonly` : used for read-only
* `lck_{workspaceSlug}_readwrite` : used for read-write access
* `lck_{workspaceSlug}_alter` : used for schema alteration

This allow us to dedicate a database and add isolation
between databases.
Data contained in a workspace database cannot be mixed
with another workspace database.
