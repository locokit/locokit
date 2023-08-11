# Engine

The LocoKit API based on Feathers use a package called `engine`.

This package help LocoKit to introspect datasource schemas,
and help `feathers-locokit` structure the meta model of the datasource.

In LocoKit, each [*workspace*](./../glossary/workspace.md)
can have one or more [*datasource*](../glossary/datasource.md).

Each [*datasource*](./../glossary/datasource.md) is a set of
tables, fields, records.

The responsability of the `engine` package is to facilitate
the discoverability of the *datasource*.
It helps to introspect the *datasource* schema.
This allow LocoKit to understand what are the tables
composing the database schema,
or which records are available.

The `engine` is not responsible of the security layer.
This must be done above it, by adding specific filters
to reduce the access (read/write) of the data,
or by choosing the right user to access the *datasource*.

## Migration

The `engine` is able to introspect a postgreSQL schema.
This is a "true" datasource, a physical one.

LocoKit store a metamodel in its database,
for each datasource.
This is a "false" datasource, a virtual one,
representing the true one.

The metamodel need to represent the most precisely
its correlated datasource.
This is the knowledge useful to LocoKit
for querying the datasource.

The database (the physical one) must also be sync
with the metamodel.

For this, we use migrations to sync the evolutions
made in the metamodel that need to be reflected
in the physical datasource,
and in the other direction too,
when the physical datasource has evolved
and the metamodel need to be updated.

Each migration is composed of 2 sets of migration actions.

The first set is for update the datasource,
the other one is for update the metamodel.

Each action need to have the minimal data to operate the update.
