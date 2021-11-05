## 0.0.4

**Data**
* Implement the multi select column type + verification of data type before injection https://gitlab.makina-corpus.net/lck/lck-api/-/issues/20
* Add a unique constraint for table + database_id https://gitlab.makina-corpus.net/lck/lck-api/-/issues/53
* Store the column order https://gitlab.makina-corpus.net/lck/lck-api/-/issues/60
* Compute the text property according to column's ids https://gitlab.makina-corpus.net/lck/lck-api/-/issues/72
* Disable pagination for row endpoint only when table_id or table_view_id is sent in query param https://gitlab.makina-corpus.net/lck/lck-api/-/issues/79
* Add the null operator for row endpoint https://gitlab.makina-corpus.net/lck/lck-api/-/issues/89
* Add a position to page to allow a sort https://gitlab.makina-corpus.net/lck/lck-api/-/issues/84
* Try to filter a data json with ilike operator and "%" https://gitlab.makina-corpus.net/lck/lck-api/-/issues/82

**User**
* Manage the lost password story https://gitlab.makina-corpus.net/lck/lck-api/-/issues/30
* Manage creation / lost password https://gitlab.makina-corpus.net/lck/lck-api/-/issues/37
* Allow only SUPERADMIN to create users https://gitlab.makina-corpus.net/lck/lck-api/-/issues/59
* Rename group role and workspace role https://gitlab.makina-corpus.net/lck/lck-api/-/issues/85
* Allow use of templates for mail customisation by the end user https://gitlab.makina-corpus.net/lck/lck-api/-/issues/91
* Decide which password rules we have to check https://gitlab.makina-corpus.net/lck/lck-api/-/issues/92
* Disable pagination on user & group https://gitlab.makina-corpus.net/lck/lck-api/-/issues/73

**Architecture**
* Better monitoring errors https://gitlab.makina-corpus.net/lck/lck-api/-/issues/51
* Add mail ability to api for user creation https://gitlab.makina-corpus.net/lck/lck-api/-/issues/71
* Update group management (depend exclusively of a workspace) https://gitlab.makina-corpus.net/lck/lck-api/-/issues/78
* Add Sentry as a monitoring tool available for tracing https://gitlab.makina-corpus.net/lck/lck-api/-/issues/81
* Hide database error messages https://gitlab.makina-corpus.net/lck/lck-api/-/issues/83
* Remove front from docker build to avoid incompatibility between front & back https://gitlab.makina-corpus.net/lck/lck-api/-/issues/93

## 0.0.3

**Architecture**
* Make knexfile.ts use an env variable for the database https://gitlab.makina-corpus.net/lck/lck-api/-/issues/41
* Make test write data in another DB https://gitlab.makina-corpus.net/lck/lck-api/-/issues/62
* Update front to v0.0.3-beta.0 https://gitlab.makina-corpus.net/lck/lck-api/-/issues/70

## 0.0.2

**Data**
* Divide seeds between core and "templates" https://gitlab.makina-corpus.net/lck/lck-api/-/issues/40

**Architecture**
* Create a POC of API's typings, and use it in the frontend to see if it's a viable option https://gitlab.makina-corpus.net/lck/lck-api/-/issues/36
* View endpoint, add the editable field to know if the current user can update the cell value https://gitlab.makina-corpus.net/lck/lck-api/-/issues/10

## 0.0.1

**Data**
* Add data to view endpoint https://gitlab.makina-corpus.net/lck/lck-api/-/issues/11
* Add container notion (between page / block) https://gitlab.makina-corpus.net/lck/lck-api/-/issues/8

**Architecture**
* Do we have to store user id in integer or uuid ? https://gitlab.makina-corpus.net/lck/lck-api/-/issues/14

**Initial release**

* Models implemented
  * auth : user, group, user_has_group
  * storage : workspace, database, table, row, column, view, column type
  * visualize : section, page, block
* Filters available
* Block available
  * table view
  * markdown
