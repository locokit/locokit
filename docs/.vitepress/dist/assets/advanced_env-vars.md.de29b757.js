import{_ as e,c as n,o as s,d as a}from"./app.ee1354cf.js";const m='{"title":"Environment variables","description":"","frontmatter":{},"headers":[{"level":2,"title":"Web server","slug":"web-server"},{"level":2,"title":"Mail server","slug":"mail-server"},{"level":2,"title":"Sentry","slug":"sentry"},{"level":2,"title":"Security","slug":"security"},{"level":2,"title":"Storage keys","slug":"storage-keys"}],"relativePath":"advanced/env-vars.md","lastUpdated":1651511425128}',t={},o=a(`<h1 id="environment-variables" tabindex="-1">Environment variables <a class="header-anchor" href="#environment-variables" aria-hidden="true">#</a></h1><p>The backend use some environment variables for configuring some part of it.</p><p>Here is a summary.</p><h2 id="web-server" tabindex="-1">Web server <a class="header-anchor" href="#web-server" aria-hidden="true">#</a></h2><div class="language-yml"><pre><code><span class="token comment"># Port on which LocoKit will listen</span>
LCK_PORT=3030
<span class="token comment"># Hostname on which LocoKit is</span>
LCK_HOST=localhost
<span class="token comment"># Public URL users will have to call the server (API mainly)</span>
<span class="token comment"># Useful for link in emails for example</span>
LCK_PUBLIC_URL=http<span class="token punctuation">:</span>//localhost<span class="token punctuation">:</span><span class="token number">8080</span>
<span class="token comment"># What is the name of this LocoKit instance</span>
<span class="token comment"># Useful for email subjects</span>
LCK_PUBLIC_PORTAL_NAME=Locokit
<span class="token comment"># Secret used to encrypt user passwords</span>
LCK_AUTH_SECRET=yoursecretforpasswordTOCHANGEABSOLUTELY
<span class="token comment"># URL connection to the database</span>
LCK_DATABASE_URL=postgres<span class="token punctuation">:</span>//postgres<span class="token punctuation">:</span>yourPostgresPassword@localhost<span class="token punctuation">:</span>5432/postgres
<span class="token comment"># [dev] URL connection to the database, only for dev/test purpose</span>
LCK_DATABASE_URL_TEST=postgres<span class="token punctuation">:</span>//postgres<span class="token punctuation">:</span>yourPostgresPassword@localhost<span class="token punctuation">:</span>5433/postgres
<span class="token comment"># [dev] Allow developer to see all requests executed in the terminal</span>
OBJECTION_DEBUG=false
</code></pre></div><h2 id="mail-server" tabindex="-1">Mail server <a class="header-anchor" href="#mail-server" aria-hidden="true">#</a></h2><p>You can connect LocoKit platform to a mail server for sending emails concerning signups, lost passwords, ...</p><p>In the default docker-compose, a <a href="https://github.com/mailhog/MailHog" target="_blank" rel="noopener noreferrer">mailhog</a> container is created, allowing you to check emails.</p><div class="language-yml"><pre><code>MAIL_PORT=1025
MAIL_SERVER=localhost
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_DEFAULT_FROM=&quot;Contact locokit&quot; &lt;contact@locokit.io<span class="token punctuation">&gt;</span>
MAIL_SECURE=false
</code></pre></div><h2 id="sentry" tabindex="-1">Sentry <a class="header-anchor" href="#sentry" aria-hidden="true">#</a></h2><p>Check <a href="https://docs.sentry.io/platforms/node/configuration/options/" target="_blank" rel="noopener noreferrer">Sentry documentation</a>.</p><div class="language-yml"><pre><code>SENTRY_DSN=
SENTRY_RELEASE=
SENTRY_ENVIRONMENT=
</code></pre></div><h2 id="security" tabindex="-1">Security <a class="header-anchor" href="#security" aria-hidden="true">#</a></h2><div class="language-"><pre><code>CORS_ORIGIN=*

# Helmet settings
# https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
HELMET_HSTS=true

# Signup keys
# Is the signup allowed on the LocoKit platform
# This will display a signup form in the front,
# and the signup endpoint will be registered
SIGNUP_ALLOWED=false
# How many tries are authorized
SIGNUP_RATE_LIMIT_MAX=5
# Within a time frame of xxx milliseconds
# If more than 5 signup during 60s
# signups will be rejected with a 429 HTTP (TooManyRequests)
SIGNUP_RATE_LIMIT_TIMEFRAME=60000
</code></pre></div><h2 id="storage-keys" tabindex="-1">Storage keys <a class="header-anchor" href="#storage-keys" aria-hidden="true">#</a></h2><div class="language-"><pre><code># type can be one of : s3 (s3 compatible object storage), fs (file system)
STORAGE_TYPE=s3
# public path can be one of : /s3-storage (s3 compatible object storage), /fs-storage (file system)
# these paths depend on your configuration (nginx or other)
STORAGE_PUBLIC_PATH=/s3-storage
STORAGE_S3_URL=http://localhost:9000
STORAGE_S3_ACCESS_KEY=minio
STORAGE_S3_SECRET_KEY=notsecret
STORAGE_S3_PATH_STYLE=1
STORAGE_S3_SIGNATURE_VERSION=v4
STORAGE_S3_DEFAULT_BUCKET=public
STORAGE_FS_PATH=../fs-storage
STORAGE_MAX_UPLOAD_SIZE=20mb
</code></pre></div><h1 id="public-url" tabindex="-1">Public URL <a class="header-anchor" href="#public-url" aria-hidden="true">#</a></h1><p>For user management purpose, you&#39;ll have to set the <code>LCK_PUBLIC_URL</code> to the public url of the front-end.</p><p>This will help users to verify their email during the signup process, or password reset.</p>`,19),r=[o];function i(l,c,p,d,h,u){return s(),n("div",null,r)}var g=e(t,[["render",i]]);export{m as __pageData,g as default};
