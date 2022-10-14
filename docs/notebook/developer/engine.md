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
