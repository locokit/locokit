# Permissions

The LCK API manage several level of permissions
for the [storage](storage.md#resources) / [visualization](visualization.md) resources.

Several resources are available :

* user
* group
* workspace
* database
* table
* table_column
* column_type
* table_row
* table_view
* chapter
* page
* block

## Grant depending on profile

| resource | action     | role granted to |
| -------- | ---------- | --------------- |
| User     | **C**reate | SUPERADMIN      |
|          |            | ADMIN           |
|          | Read       | All             |
|          | Update     | All             |
|          | Delete     | All             |


## Grant depending on workspace permissions

## Permissions on group

Group has one or several users.

Each user have a role inside the group.

A user `MEMBER` can only have access to the group,
and the resources authorized for this group.

A user `ADMIN` of a group can add users to a group,
update the role of users in this group,
or remove users from the group.

A user `OWNER` can do all things `MEMBER` and `ADMIN` can do,
and remove the group itself.

## Permissions on workspace

Permissions on workspace are managed at the group level.

Each group linked to a workspace have a role,
like a user for the group.

A group `MEMBER` can access to the workspace 
through visualization only, and via only one chapter.

A group `ADMIN` can access to the databases
and schemas of the workspace.
This group can also alter the database schema,
but can't manage permissions on the tables / columns.

A group `OWNER` can manage groups having access to this workspace,
and their roles (`MEMBER`, `ADMIN`, `OWNER`).
It can also manage permissions of tables / columns / rows,
per group.