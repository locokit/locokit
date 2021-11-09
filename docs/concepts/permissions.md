# Permissions

The LCK API manage several level of permissions
for the storage / visualization resources.

Several resources are available :

* visualization
  * chapter
  * page
  * container
  * block
* process / action
* storage
  * database
  * table
  * table_row = records
  * table_column = fields
  * table_view
  * attachment

Each group of permission is called an ACL set, 
we can find them in the `acl_set` table.

An ACL set is related to a workspace
and can be a **manager** of this one if the property `manager` is `true`.

An ACL set **manager** can manage the workspace
(in fact, all users that are at least **MEMBER** of a group related to this ACL set):
* can CRUD all workspace's resources (group, database, chapter, table, ...)
* can manage permissions on workspace's resources (database, table, ...), per group
* delete the workspace

For other set, we want to define more precisely what the set allows to.

## on database

Permissions on databases are managed at the group level.

Each group, if it have access to the database's workspace,
can have permissions on databases, allowing group's users to .

* **c**reate databases for this workspace
* **r**ead a database
* **u**pdate a database
* **d**elete databases owned by the group

Only groups that are granted `manager` on a workspace
have the permission to create and remove databases.

The permission of read / update / remove a database is granted
for each database - group combination.

If a group is not linked by a read permission to the database
it won't be able to access to the database.

## on table

Permissions on tables are managed at the group level.

Each group, if it have access to the table's workspace,
can have permissions on tables, allowing group's users to :

* **c**reate new records / rows for this table
* **r**ead records / rows of this table
* **u**pdate records / rows
* **d**elete records / rows

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
* it has the update permission on the table records
* the record to be updated respect all group's filters defined on the table's columns

## on table_view

Permissions on views are managed at the group level.

Each group, if it have access to the view's table,
can have permissions on views, allowing group's users to .

* create views for this table
* read a view
* update a view
* remove views

Only groups that are granted `manager` on a workspace
have the permission to create and remove views.

The permission of read / update a view is granted
for each view - group combination.

If a group is not linked by a read permission to the view
(and it's not a `manager` one),
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