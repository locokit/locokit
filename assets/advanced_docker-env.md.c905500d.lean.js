import{_ as e,c as r,o as a,d as t}from"./app.fc730d30.js";const f='{"title":"Sentry","description":"","frontmatter":{},"relativePath":"advanced/docker-env.md","lastUpdated":1636457197204}',s={},o=t(`__VP_STATIC_START__<h1 id="sentry" tabindex="-1">Sentry <a class="header-anchor" href="#sentry" aria-hidden="true">#</a></h1><p>Use of global vars.</p><div class="language-"><pre><code>SENTRY_DSN=
SENTRY_RELEASE=
SENTRY_ENVIRONMENT=
</code></pre></div><h1 id="mail-server" tabindex="-1">Mail server <a class="header-anchor" href="#mail-server" aria-hidden="true">#</a></h1><p>Use of global vars.</p><p>Useful for user registration, lost password, etc.</p><div class="language-"><pre><code>MAIL_PORT=
MAIL_SERVER=
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_DEFAULT_FROM=
</code></pre></div><h1 id="public-url" tabindex="-1">Public URL <a class="header-anchor" href="#public-url" aria-hidden="true">#</a></h1><p>For user management purpose, you&#39;ll have to set the <code>LCK_PUBLIC_URL</code> to the public url of the front-end.</p><p>This will help users to verify their email during the signup process, or password reset.</p>__VP_STATIC_END__`,10),n=[o];function d(i,c,l,_,p,h){return a(),r("div",null,n)}var v=e(s,[["render",d]]);export{f as __pageData,v as default};
