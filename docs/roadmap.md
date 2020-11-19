# Roadmap

NC: Not concerned

TBP: To be planned

TBC: To be checked

CRUD : **C**reate, **R**ead, **U**pdate, **D**elete

| Feature                                                                                         | API     | Front   |
| ----------------------------------------------------------------------------------------------- | ------- | ------- |
| **CRUD users**                                                                                  | OK      | CRU     |
| **CRUD groups**                                                                                 | OK      | CRU     |
| **create workspaces**                                                                           | OK      | R       |
| **affect users to groups**                                                                      | OK      | CRU     |
| **affect group to a workspace with permissions**                                                | TBP     | TBP     |
| **CRUD database (need ADMIN's group permission on workspace)**                                  | OK      | TBP     |
| check the user has creation permission of database in this workspace                            | TBP     | TBP     |
| **CRUD tables (need ADMIN's group permission on workspace)**                                    | Dec. 20 | Dec. 20 |
| check the user has creation permission of tables                                                | TBP     | TBP     |
| **CRUD columns (need ADMIN's group permission on workspace)**                                   | OK      | OK      |
| check the user has creation permission of columns                                               | TBP     | TBP     |
| allow creating columns in a table                                                               | OK      | OK      |
| allow creating column referencing another table (RELATION_BETWEEN_TABLES)                       | OK      | Dec. 20 |
| * data that'll be stored will be a { reference, value } object                                  | OK      | OK      |
| * data need to be updated each time the referenced data is mutated                              | TBC     | NC      |
| allow creating column referencing another column from another table (LOOKED_UP_COLUMN)          | OK      | Dec. 20 |
| * data that'll be stored will be a { reference, value } object                                  | OK      | OK      |
| * data need to be updated each time the referenced data is mutated                              | TBC     | NC      |
| allow creating column referencing another column from another table (SINGLE_SELECT)             | OK      | Dec. 20 |
| allow creating column referencing another column from another table (MULTI_SELECT)              | OK      | Dec. 20 |
| **Create rows in a table**                                                                      | OK      | OK      |
| check the user can create rows (permission ADMIN, or CREATE ROWS ON TABLE :id)                  | TBP     | TBP     |
| if the user can't see all rows, he can't create rows                                            | TBP     | TBP     |
| **Update rows in a table**                                                                      | OK      | OK      |
| check the user can update rows (permission ADMIN, or UPDATE ROWS ON TABLE :id)                  | TBP     | TBP     |
| a user not ADMIN can only update columns on which he has the UPDATE permission                  | TBP     | TBP     |
| if the user can't see all rows, we need to check he has access to the row he's trying to update | TBP     | TBP     |
| **read rows, sorted and filtered**                                                              | OK      | OK      |
| allow sort / filter on structured data (createdAt, updatedAt, ?)                                | OK      | TBP     |
| allow sort / filter on JSON data                                                                | OK      | OK      |
| allow sort / filter on related data (RELATION_BETWEEN_TABLES, LOOKED_UP_COLUMN)                 | OK      | TBP     |
| allow sort / filter on special data (SINGLE_SELECT, MULTI_SELECT)                               | OK      | TBP     |
| **CRUD views**                                                                                  | OK      | OK      |
| allow creating columns in a view                                                                | OK      | OK      |
| visualize data from a view                                                                      | OK      | OK      |