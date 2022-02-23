import{_ as e,c as t,o,d}from"./app.ee1354cf.js";const _='{"title":"Theme","description":"","frontmatter":{},"relativePath":"advanced/theme.md","lastUpdated":1645649317317}',i={},c=d('<h1 id="theme" tabindex="-1">Theme <a class="header-anchor" href="#theme" aria-hidden="true">#</a></h1><p>LocoKit is provided with a default theme, the <code>locokit</code> theme.</p><p>Themes are available under <code>front/public/themes</code>.</p><p>You could create a new theme by respecting these requirements :</p><p>In development mode</p><ul><li>create a new directory under <code>front/public/themes</code></li><li>inside this directory, <ul><li>one <code>theme.css</code> file, defining all css variables needed by LocoKit</li><li>one <code>theme.js</code> file, defining images for several places in the app</li><li>images this directory, and all assets needed by your theme (fonts, favicon,...)</li></ul></li></ul><p>When this theme is finished, you could deliver this theme in your <code>docker-compose</code> file by binding a volume dedicated to this theme.</p><p>In our container, the <code>/code/public/themes</code> is the directory containing themes.</p><p>You&#39;ll have to build a <code>index.html</code> too, referencing the defined theme, with the <code>npm run build:html</code> available in the <code>front</code> directory. By defining environment variables <code>VUE_APP_TITLE</code> and <code>VUE_APP_THEME</code>, your <code>index.html</code> will load your <code>theme.js</code>, <code>theme.css</code>, etc from your theme.</p>',9),n=[c];function a(r,l,s,h,m,p){return o(),t("div",null,n)}var f=e(i,[["render",a]]);export{_ as __pageData,f as default};
