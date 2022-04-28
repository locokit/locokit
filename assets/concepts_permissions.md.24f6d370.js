import{_ as e,c as a,o as t,d as o}from"./app.ee1354cf.js";const m='{"title":"Permissions","description":"","frontmatter":{},"headers":[{"level":2,"title":"on database","slug":"on-database"},{"level":2,"title":"on table","slug":"on-table"},{"level":2,"title":"on table_column","slug":"on-table-column"},{"level":2,"title":"on table_view","slug":"on-table-view"},{"level":2,"title":"Summary","slug":"summary"}],"relativePath":"concepts/permissions.md","lastUpdated":1651164818456}',r={},s=o('<h1 id="permissions" tabindex="-1">Permissions <a class="header-anchor" href="#permissions" aria-hidden="true">#</a></h1><p>The LCK API manage several level of permissions for the storage / visualization resources.</p><p>Several resources are available :</p><ul><li>visualization <ul><li>chapter</li><li>page</li><li>container</li><li>block</li></ul></li><li>process / action</li><li>storage <ul><li>database</li><li>table</li><li>table_row = records</li><li>table_column = fields</li><li>table_view</li><li>attachment</li></ul></li></ul><p>Each group of permission is called an ACL set, we can find them in the <code>acl_set</code> table.</p><p>An ACL set is related to a workspace and can be a <strong>manager</strong> of this one if the property <code>manager</code> is <code>true</code>.</p><p>An ACL set <strong>manager</strong> can manage the workspace (in fact, all users that are at least <strong>MEMBER</strong> of a group related to this ACL set):</p><ul><li>can CRUD all workspace&#39;s resources (group, database, chapter, table, ...)</li><li>can manage permissions on workspace&#39;s resources (database, table, ...), per group</li><li>delete the workspace</li></ul><p>For other set, we want to define more precisely what the set allows to.</p><h2 id="on-database" tabindex="-1">on database <a class="header-anchor" href="#on-database" aria-hidden="true">#</a></h2><p>Permissions on databases are managed at the group level.</p><p>Each group, if it have access to the database&#39;s workspace, can have permissions on databases, allowing group&#39;s users to .</p><ul><li><strong>c</strong>reate databases for this workspace</li><li><strong>r</strong>ead a database</li><li><strong>u</strong>pdate a database</li><li><strong>d</strong>elete databases owned by the group</li></ul><p>Only groups that are granted <code>manager</code> on a workspace have the permission to create and remove databases.</p><p>The permission of read / update / remove a database is granted for each database - group combination.</p><p>If a group is not linked by a read permission to the database it won&#39;t be able to access to the database.</p><h2 id="on-table" tabindex="-1">on table <a class="header-anchor" href="#on-table" aria-hidden="true">#</a></h2><p>Permissions on tables are managed at the group level.</p><p>Each group, if it have access to the table&#39;s workspace, can have permissions on tables, allowing group&#39;s users to :</p><ul><li><strong>c</strong>reate new records / rows for this table</li><li><strong>r</strong>ead records / rows of this table</li><li><strong>u</strong>pdate records / rows</li><li><strong>d</strong>elete records / rows</li></ul><h2 id="on-table-column" tabindex="-1">on table_column <a class="header-anchor" href="#on-table-column" aria-hidden="true">#</a></h2><p>Permissions on columns are managed at the group level.</p><p>Each group, if it have access to the column&#39;s table, can have permissions on columns, allowing group&#39;s users to :</p><ul><li>read the column value in a record / row</li><li>write (update) the column value in a record / row</li></ul><p>For columns, each permission can be enhanced with a filter property. This filter property will limit the records available for the group.</p><p>This filter will have an effect for all records operations (CRUD). For example, a group would be able to update a record only if :</p><ul><li>it has the update permission on the table records</li><li>the record to be updated respect all group&#39;s filters defined on the table&#39;s columns</li></ul><h2 id="on-table-view" tabindex="-1">on table_view <a class="header-anchor" href="#on-table-view" aria-hidden="true">#</a></h2><p>Permissions on views are managed at the group level.</p><p>Each group, if it have access to the view&#39;s table, can have permissions on views, allowing group&#39;s users to .</p><ul><li>create views for this table</li><li>read a view</li><li>update a view</li><li>remove views</li></ul><p>Only groups that are granted <code>manager</code> on a workspace have the permission to create and remove views.</p><p>The permission of read / update a view is granted for each view - group combination.</p><p>If a group is not linked by a read permission to the view (and it&#39;s not a <code>manager</code> one), it won&#39;t be able to access to the view.</p><p>When removing views, if the last view linked to a group is removed, the table&#39;s permission &quot;read&quot; of the group is automatically removed. The group won&#39;t be able to read any records of the referenced table.</p><h2 id="summary" tabindex="-1">Summary <a class="header-anchor" href="#summary" aria-hidden="true">#</a></h2><table><thead><tr><th>resource</th><th>permission</th><th>allows to</th></tr></thead><tbody><tr><td>workspace</td><td></td><td></td></tr><tr><td>database</td><td></td><td></td></tr><tr><td>table</td><td></td><td></td></tr><tr><td>records (rows)</td><td></td><td></td></tr><tr><td>fields (columns)</td><td></td><td></td></tr><tr><td>views</td><td></td><td></td></tr></tbody></table>',37),i=[s];function l(n,d,p,c,h,u){return t(),a("div",null,i)}var g=e(r,[["render",l]]);export{m as __pageData,g as default};