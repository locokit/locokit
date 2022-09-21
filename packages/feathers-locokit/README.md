This package helps you create a feathers service
for a locokit engine, a API over SQL or API over API service.

LocoKit engine allow you to create adapter to
easily connect to a data source
as an SQL database, or a supported API.

The feathers service will be able to make request
against your data source,
to CRUD resources.

This service, when created, will try to retrieve
all data source schema information, to create all
sub services needed to retrieve data,
for all available tables in your data source, for an SQL database.

If this is an API,
the service will be more a "API over API",
but it will unify the way you request your datasource.
