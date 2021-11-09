import{_ as e,c as a,o as t,d as o}from"./app.bb6a31ba.js";const m='{"title":"Webhooks","description":"","frontmatter":{},"relativePath":"admin-manual/webhooks.md","lastUpdated":1636470238598}',i={},r=o('<h1 id="webhooks" tabindex="-1">Webhooks <a class="header-anchor" href="#webhooks" aria-hidden="true">#</a></h1><p>LocoKit integrate a webhook mechanism.</p><p>You can configure at several level the trigger of a URL call :</p><ul><li>when a record is created</li><li>when a record is updated</li><li>when a specific column of a record is updated</li><li>trigger manual</li><li>CRON (not implemented)</li></ul><p>Each call of the URL will be made with the record id in parameters.</p><p>The data itself is not sent, so if you need it, you have to authenticate against the LocoKit platform and retrieve all the data needed through the API.</p>',6),n=[r];function s(l,c,d,h,p,_){return t(),a("div",null,n)}var f=e(i,[["render",s]]);export{m as __pageData,f as default};
