import{_ as t,c as d,o as r,d as e}from"./app.5ea13208.js";const u='{"title":"Roadmap","description":"","frontmatter":{},"relativePath":"roadmap.md","lastUpdated":1726225155761}',o={},a=e('<h1 id="roadmap" tabindex="-1">Roadmap <a class="header-anchor" href="#roadmap" aria-hidden="true">#</a></h1><p>NC: Not concerned</p><p>TBP: To be planned</p><p>TBC: To be checked</p><p>CRUD : <strong>C</strong>reate, <strong>R</strong>ead, <strong>U</strong>pdate, <strong>D</strong>elete</p><table><thead><tr><th>Feature</th><th>API</th><th>Front</th></tr></thead><tbody><tr><td><strong>CRUD users</strong></td><td>OK</td><td>CRU</td></tr><tr><td><strong>CRUD groups</strong></td><td>OK</td><td>CRU</td></tr><tr><td><strong>create workspaces</strong></td><td>OK</td><td>R</td></tr><tr><td>only <code>CREATOR</code> profiles can create workspace</td><td>S1 21</td><td>S1 21</td></tr><tr><td><strong>affect users to groups</strong></td><td>OK</td><td>CRU</td></tr><tr><td><strong>affect group to a workspace with permissions</strong></td><td>TBP</td><td>TBP</td></tr><tr><td><strong>CRUD database (need ADMIN&#39;s group permission on workspace)</strong></td><td>OK</td><td>TBP</td></tr><tr><td>check the user has creation permission of database in this workspace</td><td>TBP</td><td>TBP</td></tr><tr><td><strong>CRUD tables (need ADMIN&#39;s group permission on workspace)</strong></td><td>OK</td><td>OK</td></tr><tr><td>check the user has creation permission of tables</td><td>TBP</td><td>TBP</td></tr><tr><td><strong>CRUD columns (need ADMIN&#39;s group permission on workspace)</strong></td><td>OK</td><td>OK</td></tr><tr><td>check the user has creation permission of columns</td><td>TBP</td><td>TBP</td></tr><tr><td>allow creating columns in a table</td><td>OK</td><td>OK</td></tr><tr><td>allow creating column referencing another table (RELATION_BETWEEN_TABLES)</td><td>OK</td><td>OK</td></tr><tr><td>* data that&#39;ll be stored will be a { reference, value } object</td><td>OK</td><td>OK</td></tr><tr><td>* data need to be updated each time the referenced data is mutated</td><td>TBC</td><td>NC</td></tr><tr><td>allow creating column referencing another column from another table (LOOKED_UP_COLUMN)</td><td>OK</td><td>OK</td></tr><tr><td>* data that&#39;ll be stored will be a { reference, value } object</td><td>OK</td><td>OK</td></tr><tr><td>* data need to be updated each time the referenced data is mutated</td><td>OK</td><td>NC</td></tr><tr><td>allow creating column referencing another column from another table (SINGLE_SELECT)</td><td>OK</td><td>OK</td></tr><tr><td>allow creating column referencing another column from another table (MULTI_SELECT)</td><td>OK</td><td>OK</td></tr><tr><td><strong>Create rows in a table</strong></td><td>OK</td><td>OK</td></tr><tr><td>check the user can create rows (permission ADMIN, or CREATE ROWS ON TABLE :id)</td><td>TBP</td><td>TBP</td></tr><tr><td>if the user can&#39;t see all rows, he can&#39;t create rows</td><td>TBP</td><td>TBP</td></tr><tr><td><strong>Update rows in a table</strong></td><td>OK</td><td>OK</td></tr><tr><td>check the user can update rows (permission ADMIN, or UPDATE ROWS ON TABLE :id)</td><td>TBP</td><td>TBP</td></tr><tr><td>a user not ADMIN can only update columns on which he has the UPDATE permission</td><td>TBP</td><td>TBP</td></tr><tr><td>if the user can&#39;t see all rows, we need to check he has access to the row he&#39;s trying to update</td><td>TBP</td><td>TBP</td></tr><tr><td><strong>read rows, sorted and filtered</strong></td><td>OK</td><td>OK</td></tr><tr><td>allow sort / filter on structured data (createdAt, updatedAt, ?)</td><td>OK</td><td>TBP</td></tr><tr><td>allow sort / filter on JSON data</td><td>OK</td><td>OK</td></tr><tr><td>allow sort / filter on related data (RELATION_BETWEEN_TABLES, LOOKED_UP_COLUMN)</td><td>OK</td><td>OK</td></tr><tr><td>allow sort / filter on special data (SINGLE_SELECT, MULTI_SELECT)</td><td>OK</td><td>OK</td></tr><tr><td><strong>CRUD views</strong></td><td>OK</td><td>OK</td></tr><tr><td>allow creating columns in a view</td><td>OK</td><td>OK</td></tr><tr><td>visualize data from a view</td><td>OK</td><td>OK</td></tr></tbody></table><p>Real time update on front through web socket com\xB0 Permissions Map edition Theme OK</p>',7),s=[a];function n(c,i,l,h,p,O){return r(),d("div",null,s)}var T=t(o,[["render",n]]);export{u as __pageData,T as default};
