# Permissions

The LCK API manage several level of permissions
for the [storage](storage.md#resources) / [visualization](visualization.md) resources.

Several resources are available :

* storage
  * database
  * table (and rows / records)
  * table_column = fields
  * table_view
* visualization
  * chapter
  * page
  * container
  * block

## on workspace

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

## on database

Permissions on databases are managed at the group level.

Each group, if it have access to the database's workspace,
can have permissions on databases, allowing group's users to .

* create databases for this workspace
* read a database
* update a database
* remove databases owned by the group


Only groups that are `OWNER` or `ADMIN` on a workspace
are granted the permission to create and remove any databases.

The permission of read / update / remove a database is granted
for each database - group combination.

If a group have the create database permission,
every database created will be linked to this group 
with a full permission, ie the `CRUD` permission.

If a group is not linked by a read permission to the database
(and it's not a `OWNER` or `ADMIN` one),
it won't be able to access to the database.

## on table

Permissions on tables are managed at the group level.

Each group, if it have access to the table's workspace,
can have permissions on tables, allowing group's users to :

* create new records / rows for this table
* read records / rows of this table
* update records / rows
* delete records / rows

## on table_column

Permissions on columns are managed at the group level.

Each group, if it have access to the column's table,
can have permissions on columns, allowing group's users to :

* read the column value in a record / row
* write (update) the column value in a record / row

For columns, each permission can be enhanced with a filter property.
This filter property will limit the records available
for the group.
This filter will have an effect for all records operations (CRUD).
For example, a group would be able to update a record
only if :
* it has the update permission on the table
* the record to be updated respect all group's filters defined on the table's columns

## on table_view

Permissions on views are managed at the group level.

Each group, if it have access to the view's table,
can have permissions on views, allowing group's users to .

* create views for this table
* read a view
* update a view
* remove views

Only groups that are `OWNER` or `ADMIN` on a workspace
are granted the permission to create and remove views.

The permission of read / update a view is granted
for each view - group combination.

If a group is not linked by a read permission to the view
(and it's not a `OWNER` or `ADMIN` one),
it won't be able to access to the view.

When removing views, if the last view linked to a group is removed,
the table's permission "read" of the group is automatically removed.
The group won't be able to read any records of the referenced table.

## Summary

| resource         | permission | allows to |
| ---------------- | ---------- | --------- |
| workspace        |            |           |
| database         |            |           |
| table            |            |           |
| records (rows)   |            |           |
| fields (columns) |            |           |
| views            |            |           |