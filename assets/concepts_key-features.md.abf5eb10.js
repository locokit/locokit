import{_ as e,c as a,o as t,d as o}from"./app.ee1354cf.js";const b='{"title":"Key features","description":"","frontmatter":{"sidebar":true,"sidebarDepth":2},"headers":[{"level":2,"title":"Workspace","slug":"workspace"},{"level":2,"title":"Database","slug":"database"},{"level":2,"title":"Authentication / Permissions","slug":"authentication-permissions"},{"level":2,"title":"Workflows","slug":"workflows"},{"level":2,"title":"Files / S3","slug":"files-s3"},{"level":2,"title":"Application / App builder","slug":"application-app-builder"}],"relativePath":"concepts/key-features.md","lastUpdated":1647246235138}',s={},r=o('<h1 id="key-features" tabindex="-1">Key features <a class="header-anchor" href="#key-features" aria-hidden="true">#</a></h1><p>LocoKit use several notions, this section will explain them.</p><h2 id="workspace" tabindex="-1">Workspace <a class="header-anchor" href="#workspace" aria-hidden="true">#</a></h2><p>The workspace is the repository of your data, your application and all that is related : groups, users, permissions, and also workflows.</p><p>When you access to a LocoKit instance, as a user, you will access to workspaces other users create or you have created.</p><p>In your workspaces, you&#39;ll be able to manage your data, and configure an application dedicated to your users.</p><p>In workspaces you have access, according to your permissions, you&#39;ll be able to access data, create or update it, manage it, or even configure the dedicated application of this workspace.</p><h2 id="database" tabindex="-1">Database <a class="header-anchor" href="#database" aria-hidden="true">#</a></h2><p>A workspace can have one (and soon several) database.</p><p>Each database will be defined with a <strong>schema</strong>. A specific UI will allow you define your database <strong>tables</strong>, each table will be composed of fields and records.</p><p>A <strong>field</strong> is like a table column. You create one field, set its type, maybe a default value or a formula, and that&#39;s it.</p><p>A <strong>record</strong> is a set of values, for the related table. Think of a line in a spreadsheet, or a row in a database.</p><p><strong>Relations</strong> can be defined between tables, allowing records to be linked.</p><p>A spreadsheet-like UI is available for editing your data.</p><p>You can define also <strong>views</strong> of your data, by selecting fields and by applying filters on it.</p><h2 id="authentication-permissions" tabindex="-1">Authentication / Permissions <a class="header-anchor" href="#authentication-permissions" aria-hidden="true">#</a></h2><p>A workspace can be available for users, or groups of users.</p><p>A dedicated section is available in the workspace manager interface, allowing workspace managers to configure what&#39;s authorized for groups. Create, Read, Update or Delete on tables.</p><p>You can also define specific filters on the tables to define exactly what can be read / updated / deleted. In this advanced use case, you&#39;ll have to write JSON code.</p><h2 id="workflows" tabindex="-1">Workflows <a class="header-anchor" href="#workflows" aria-hidden="true">#</a></h2><p>When data is created / updated / removed, workflows can be triggered.</p><p>A workflow is an external program, callable from the LocoKit platform with a webhook, through a HTTP GET or POST.</p><p>This allows you to call webhooks for example, to react to data updates.</p><h2 id="files-s3" tabindex="-1">Files / S3 <a class="header-anchor" href="#files-s3" aria-hidden="true">#</a></h2><p>The LocoKit platform is able to manage files, in a classic file system, or a S3-like system.</p><h2 id="application-app-builder" tabindex="-1">Application / App builder <a class="header-anchor" href="#application-app-builder" aria-hidden="true">#</a></h2><p>You can create your application thanks to our app builder.</p><p>With the configuration of permissions, you can create <strong>chapters</strong> dedicated to a group of users.</p><p>Each chapter will be composed of <strong>pages</strong>, displaying data accordingly to the logged user.</p><p>This data will come from the <strong>views</strong> you will display through <a href="./block-types.html"><strong>blocks</strong></a>.</p>',30),i=[r];function l(n,d,p,c,h,u){return t(),a("div",null,i)}var g=e(s,[["render",l]]);export{b as __pageData,g as default};
