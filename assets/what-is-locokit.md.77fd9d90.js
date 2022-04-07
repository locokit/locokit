import{_ as e,c as t,o,d as a}from"./app.ee1354cf.js";const m='{"title":"What is LocoKit ?","description":"","frontmatter":{},"headers":[{"level":2,"title":"Technically, what is it ?","slug":"technically-what-is-it"},{"level":2,"title":"Functionnaly, what is it ?","slug":"functionnaly-what-is-it"},{"level":2,"title":"LocoKit means... ?","slug":"locokit-means"},{"level":2,"title":"Motivation, why we built LocoKit ?","slug":"motivation-why-we-built-locokit"}],"relativePath":"what-is-locokit.md","lastUpdated":1649339779082}',s={},r=a('<h1 id="what-is-locokit" tabindex="-1">What is LocoKit ? <a class="header-anchor" href="#what-is-locokit" aria-hidden="true">#</a></h1><p><strong>LocoKit</strong> is an <strong>open source platform</strong> which provide <strong>Database Management</strong> as a spreadsheet with an <strong>App Builder</strong>.</p><p>You can create your <strong>database</strong> with a <strong>spreadsheet-like UI</strong>, that helps you define your data model, and manage your data.</p><p>Based on your data, you can build a <strong>dedicated app</strong> with our <strong>app builder</strong>, by assembling <a href="./concepts/block-types.html">blocks</a> (markdown, table, maps\u2026).</p><p>We call that kind of tools <strong>no-code</strong> tools, or <strong>low-code</strong> tools.</p><p>The best example is <a href="https://airtable.com" target="_blank" rel="noopener noreferrer">AirTable</a>. A tool that allows you to build <strong>your</strong> database, <strong>your</strong> tool.</p><p>They allow users to build app with a no-code / low-code tool.</p><div class="warning custom-block"><p class="custom-block-title">LocoKit is still in early stages</p><p><strong>LocoKit</strong> is still in its 0.x.x versions.</p><p>But, we think we have developed enough to share the code and allow other to test it, use it, and adopt it.</p><p>We have deployed several instances of <strong>LocoKit</strong> and we are learning from our customers what is missing the most.</p><p>We know there are still issues regarding usability, documentation or maybe performance. We&#39;re working on that ! \u{1F4AA} You can help us by creating issues in our github repository.</p><p>Feel free to join us on <a href="https://github.com/locokit/locokit" target="_blank" rel="noopener noreferrer">GitHub</a>, and add a \u2B50 to make us happy \u{1F609} .</p><p>Newcomers or contributors are really appreciated and welcome !</p></div><h2 id="technically-what-is-it" tabindex="-1">Technically, what is it ? <a class="header-anchor" href="#technically-what-is-it" aria-hidden="true">#</a></h2><p><strong>Technically</strong>, the <strong>LocoKit</strong> platform is a <a href="https://nodejs.org" target="_blank" rel="noopener noreferrer">NodeJS</a> + <a href="https://feathersjs.com" target="_blank" rel="noopener noreferrer">FeathersJS</a> + <a href="https://vuejs.org" target="_blank" rel="noopener noreferrer">VueJS</a> powered platform.</p><h2 id="functionnaly-what-is-it" tabindex="-1">Functionnaly, what is it ? <a class="header-anchor" href="#functionnaly-what-is-it" aria-hidden="true">#</a></h2><p><strong>Functionnaly</strong>, the <strong>LocoKit</strong> platform is a web platform allowing users to :</p><ul><li>create database (with tables, related tables\u2026), like a mini AirTable app</li><li>grant access to this data, according users permissions (via group)</li><li>visualize data, through a hierarchy of chapter / page / container / block, like a mini App</li><li>process data, by trigerring webhooks</li></ul><p>For now, LocoKit generate a meta model of your data, and store all your data in a single table in the database, with <code>jsonb</code> fields. We use a PostGreSQL database under the hood, with PostGIS enabled for geometry fields.</p><h2 id="locokit-means" tabindex="-1">LocoKit means... ? <a class="header-anchor" href="#locokit-means" aria-hidden="true">#</a></h2><p><strong>LocoKit</strong> mean <strong>Low-code Kit</strong>. Sometimes we name it <strong>LCK</strong>.</p><p>We want to create a tool simple enough for &quot;non IT&quot; users, allowing them managing their data and their app. Without too much headaches. We hope.</p><p>This tool is <em>&quot;Low-Code&quot;</em> because you may have to write some code (like formulas, advanced settings\u2026), or configure some parts of it (like webhook triggers) helping the platform to better understand what you exactly want/need.</p><h2 id="motivation-why-we-built-locokit" tabindex="-1">Motivation, why we built LocoKit ? <a class="header-anchor" href="#motivation-why-we-built-locokit" aria-hidden="true">#</a></h2><p>The <strong>LocoKit</strong>&#39;s adventure started in 2020.</p><p>At this time, we searched an <strong>open source</strong> tool to build a information system for a customer.</p><p>We used <strong>SeaTable</strong>, but we understood lately that <strong>SeaTable</strong> won&#39;t be really open sourced.</p><p>We had to find another solution. After some searches, we didn&#39;t find a solution able to manage a user-friendly spreadsheet, permissions at row levels, malleable data and to use different interfaces to visualize data (Dataviz).</p><p>We decided to build it, make it reusable through other projects, and finally free the code if it was ok for us. That was the beginning of this adventure.</p><p>Our customer needed to be as autonomous as it could be, and as our company name is <strong>Autonomens</strong>, that was making sense, wasn&#39;t it ?</p>',25),i=[r];function n(l,h,d,c,p,u){return o(),t("div",null,i)}var w=e(s,[["render",n]]);export{m as __pageData,w as default};
