# Policy

This section explains how LocoKit
manage roles, permissions and policies.

Permissions exist at several levels:
* at the *core* level,
* at the *workspace* level,
* at the *group* level

The `core` level is related to the API endpoints under `core/` path:
* workspace
* user
* group
* user-group
* table
* datasource
* policy

The `workspace` level is related to the API endpoints under `workspace/` path:
* datasource
* migration
* table
* table-field
* table-record
* table-relation
* workflow
* workflow-run

The `group` level is related to all updates concerning user's groups.

## Public policy

::: warning
This section need to be implemented correctly.
:::

There is a public policy
at the core and workspace level.

Users unauthenticated are linked to this policy.

Unauthenticated users can:
* signup if the use case is enabled at the platform level
* read public workspaces and public resources of these workspaces (datasources, metamodel, records, ...)
* create records in public datasource if the public policy of the workspace allows it

## Core level

A user has a **profile** at the platform level.

The **profile** can be :
* `MEMBER`
* `CREATOR`
* `ADMIN`

**`MEMBER`**

A `MEMBER` has access to the platform.

He can't create any workspace.

He has access to all resources he's able too.
It can be workspace's resources on which he's a group member
(explained later in the `workspace` level).

The `MEMBER` can access
* `core/user` to search any user by its `username`
* `core/workspace` to retrieve public and workspace he has access to

**`CREATOR`**

A `CREATOR` has access to the platform.

He can create a workspace.
As the workspace's creator,
he becomes automatically the owner and the manager
of this workspace.

He can create groups inside this workspace,
add users to them, create datasources, workflows,
all actions needed to manage the workspace.

He can also remove the workspace.

::: info
At this point, the owner can only **soft delete** the workspace.

The final removal is managed by the platform managers.
:::

He can invite other members to its workspace,
through groups.

The `CREATOR` can access
* `core/user` to search any user by its `username`
* `core/workspace` to retrieve public and workspace he has access to

**`ADMIN`**

`ADMIN`s are the platform managers.

They can do everything on the platform to manage it.

They can manage users (add them, configure them),
manage every workspaces
(removing definitely them included),
access to all workspace's metadata and data.

They can block users, by forbiding a user to log in the platform.

The `ADMIN` can access all `core/` endpoints:
* `core/user`
* `core/group`
* `core/user-group`
* `core/policy`
* `core/table`
* `core/datasource`
* `core/workspace`

## Workspace level

::: info
Only the owner of a workspace can *soft delete* it.
`ADMIN` users can remove it definitely.
:::

### Group, Datasource, table, field, relation, dataset, workspace

Only users members of a manager group can
manage (CRUD) groups, datasources, etc.

### Record

A record is, eg, a row in a table for a database,
or a record in an API like BaseRow / AirTable.

At this level, a user can access records
through Access Control List rules.

These ACL rules are defined at the `policy` level.

Each `group` is linked to one single `policy`.

**Mapping values**

A `policy` can specify a `group` or a `user` must provide some mapping values,
eg a match between a `group` and a business item in the datasource.

Those values can be defined at the `group` level, the `user` level or both.

Default value is overrided by the `group` value,
and can be overrided by the `user` value.

| Variable | Level | Foreign table | Foreign field | Default value | Required |
|---|---|---|---|---|---|
| `mappingGroupId` | `group` | `farm` | `id` | | true |
| `mappingUserId` | `user` | `operator` | `uuid` | | true |
| `customVariable` | `group`, `user` | `item` | `status` | `ALL` | false |

**Actions on tables**

We distinguish 4 **actions** on a record : *create*, *read*, *update*, *delete*.

Each user can be member of one or several workspace's group.

Each group has a policy in the workspace.

Each policy define rules at the table level, composed by :
* an action (the four previously defined),
* a set of filters applied to records, allowing hiding records unavailable for the user

| Table name | Create | Read | Update | Delete | Read filters       | Update filters | Delete filters      |
| ---------- | ------ | ---- | ------ | ------ | ------------------ | -------------- | ------------------- |
| Table 1    | x      |      |        |        | `{ id: {userId} }` |                |                     |
| Table 2    |        | x    |        |        |                    |                | `{ id: {groupId} }` |
| Table 3    | x      | x    | x      | x      |                    |                |                     |

Some tables can be available for creation,
and other ones only for reading, depending on
the policy defined by the workspace's managers.

**Rules at table level**

Rules are filters on table.

Let's take an example.

We have a database containing birdhouses,
that are installed on parcels,
and each parcel is related to a farm.

`Farm < Parcel < Birdhouse`

Each farm is owned by a farmer.

Each farmer has a user account on the platform.

A workspace contains a datasource for this database.

Each farmer is member of a group that is equivalent
of a farm.

We have in the workspace a mapping table
matching the group id and the farm id
in the database.

The use case is to display all birdhouses
for a farmer.
We would like to show the farmer
only the birdhouses that are on its parcels.

For this, we need to filter birdhouses
by `parcel > farm id`.

This should give us the following rules table:

| Table name | Create | Read | Update | Delete | Read filters                                   | Update filters                                 | Delete filters |
| ---------- | ------ | ---- | ------ | ------ | ---------------------------------------------- | ---------------------------------------------- | -------------- |
| Farm       |        | x    | x      |        | -                                              | `{ id: {mappingFarmId} }`                      | -              |
| Parcel     |        | x    | x      |        | `{ farm_id: {mappingFarmId} }`                 | `{ farm_id: {mappingFarmId} }`                 | -              |
| Birdhouse  |        | x    | x      |        | `{ lck_acl_parcel:farm_id : {mappingFarmId} }` | `{ lck_acl_parcel:farm_id : {mappingFarmId} }` | -              |

At the engine level (under the hood),
the `lck_acl_parcel` is a dedicated alias
to join the `parcel` table.

::: warning
The `lck_acl_` prefix is a reserved prefix.
You should not name your table like this.
:::



**Access on table fields**

A read/write permission can be defined
the same way at the field level.

| Table field        | Read | Write | Read filter                                    | Write filter                                   |
| ------------------ | ---- | ----- | ---------------------------------------------- | ---------------------------------------------- |
| Farm name          | x    | x     | -                                              | `{ id: {mappingFarmId} }`                      |
| Parcel geometry    | x    |       | `{ farm_id: {mappingFarmId} }`                 | `{ farm_id: {mappingFarmId} }`                 |
| Birdhouse position | x    | x     | `{ lck_acl_parcel:farm_id : {mappingFarmId} }` | `{ lck_acl_parcel:farm_id : {mappingFarmId} }` |

These rule should work both sides,
server and client side, to be isomorphic.
This implies the data `lck_acl_parcel:farm_id`
to be available on the client side.

::: info
Policy rules are available on the client side.

This allows isomorphic security checks.
:::


## Group level

A group is a user set, allowing to have a logical unit.

**Manager group**

A group can be a manager one.

In this case, all users of this group
can manage the workspace.

**Group mapping values**

If the `policy` need dedicated mapping variables,
the `group` must provide them.

| Variable         | Workspace value     |
| ---------------- | ------------------- |
| `mappingFarmId`  | `uuid-group-farm-1` |
| `customVariable` | `FARM`              |

## User level

Some variables need to be defined at the `user` level.

We'll find another mapping array, in the `user-group` table.

| Variable         | Workspace value     |
| ---------------- | ------------------- |
| `mappingUserId`  | `uuid-operator-1`   |
| `customVariable` | `OPERATOR`          |
