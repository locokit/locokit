import{_ as e,c as a,o as t,d as o}from"./app.78152875.js";const m='{"title":"LCK Home page","description":"Home page of the Low-Code Kit platform","frontmatter":{"title":"LCK Home page","author":"Mathieu DARTIGUES","description":"Home page of the Low-Code Kit platform"},"headers":[{"level":2,"title":"So, what exactly is LCK ?","slug":"so-what-exactly-is-lck"},{"level":2,"title":"How can I get it ?","slug":"how-can-i-get-it"},{"level":2,"title":"How can I use it ?","slug":"how-can-i-use-it"},{"level":2,"title":"How can I understand how this platform work, and what can I really do with it ?","slug":"how-can-i-understand-how-this-platform-work-and-what-can-i-really-do-with-it"}],"relativePath":"index.md","lastUpdated":1640958581251}',i={},l=o('<h1 id="locokit-documentation" tabindex="-1">LocoKit Documentation <a class="header-anchor" href="#locokit-documentation" aria-hidden="true">#</a></h1><p>Welcome on the LocoKit Documentation.</p><p>LocoKit mean &quot;Low-Code Kit&quot;. We name it also LCK.</p><p>We want to build a portal that help user build easily a database, and an app on top of it, without coding too much. &quot;Low code&quot;.</p><p>This portal is here to explain what is LCK platform, and how it works under the hood.</p><h2 id="so-what-exactly-is-lck" tabindex="-1">So, what exactly is LCK ? <a class="header-anchor" href="#so-what-exactly-is-lck" aria-hidden="true">#</a></h2><p><strong>Technically</strong>, LCK platform is a NodeJS + FeathersJS + VueJS powered platform.</p><p><strong>Functionnaly</strong>, LCK platform is a web platform allowing users to :</p><ul><li>create database (with tables, related tables, ...), like a mini AirTable app</li><li>grant access to this data, according users permissions (via group)</li><li>visualize data, through a hierarchy of chapter / page / container / block, like a mini CMS</li><li>process data, with a minimum viable orchestrator</li></ul><p>What we hear by <em>&quot;Low-Code&quot;</em> is the fact that you&#39;ll need, sometimes, to write some code, helping the platform to better understand what you exactly want / need.</p><p>For example, that will be necessary when you&#39;ll write formulas for computed columns, allowing you to compute data &quot;automagically&quot;.</p><p>Or when automating some processes with the orchestrator.</p><h2 id="how-can-i-get-it" tabindex="-1">How can I get it ? <a class="header-anchor" href="#how-can-i-get-it" aria-hidden="true">#</a></h2><p>The LCK platform is compose of several packages :</p><ul><li>backend <ul><li>several docker images (the API based on Feathers, the db based on PostGreSQL, ...)</li></ul></li><li>frontend <ul><li>the generic build is archived</li><li>for a custom build, you&#39;ll need to enhance visuals from the build, or the theme</li></ul></li><li>client library (node + browser) <ul><li>based on the FeathersJS client</li><li>includes the typings of the platform (User, Group, Permission, Workspace, ...)</li><li>and several methods already wired to the backend for starting more quickly</li><li>not available at this time</li></ul></li></ul><h2 id="how-can-i-use-it" tabindex="-1">How can I use it ? <a class="header-anchor" href="#how-can-i-use-it" aria-hidden="true">#</a></h2><p>The best way to use it, for now, is to write a <code>docker-compose.yml</code> file.</p><p>You could specify two containers, based on a <code>lck-backend</code> image for the first one, and on a nginx image for the second one.</p><p>You&#39;ll have to put the front archive available for the nginx container.</p><p>TODO: provide a docker-compose.yml example</p><h2 id="how-can-i-understand-how-this-platform-work-and-what-can-i-really-do-with-it" tabindex="-1">How can I understand how this platform work, and what can I really do with it ? <a class="header-anchor" href="#how-can-i-understand-how-this-platform-work-and-what-can-i-really-do-with-it" aria-hidden="true">#</a></h2><p>You&#39;re in the right place !</p><p>You can follow the several pages to understand how the platform is made, and what you can do with it.</p><p>Understand what we call :</p><ul><li>storage</li><li>visualization</li><li>permissions</li><li>orchestration</li></ul><p>Use it :</p><ul><li>create a workspace</li><li>create a database (tables, columns, rows)</li><li>create groups</li><li>create a visualisation space through chapters / pages / containers / blocks</li><li>manage permissions</li></ul><p>Advanced usage</p><ul><li>discover special columns <ul><li><code>RELATION_BETWEEN_TABLES</code></li><li><code>LOOKED_UP_COLUMN</code></li></ul></li><li>formulas in data</li></ul>',29),r=[l];function s(n,c,h,d,p,u){return t(),a("div",null,r)}var f=e(i,[["render",s]]);export{m as __pageData,f as default};
