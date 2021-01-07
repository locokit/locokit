# Storage

## Resources

### Workspace

### Database

### Table

### Table columns

### Table rows

### Table_view

### Table_view_has_table_column

 - __table_view_id__: reference to the table view id
 - __table_column_id__: reference to the table column id
 - __position__: order of the column in the view table
 - __filter__: filter according to Default Query Operators of Feathersjs (e.g `{"$eq": "{userId}"}`)
 - __displayed__: whether the column has to be displayed
 - __transmitted__: whether the column is transmitted in the API response. Default value: `true`
 - __editable__: whether the column is editable
 - __style__: inject style css rules to the column (e.g `{"width": 583}`)
 - __default__: value which specify a data/template in order to parameterize a behaviour (e.g `{rowId}`)
 - __sort__: sorts values into a column. (e.g `ASC` or `DESC`)
