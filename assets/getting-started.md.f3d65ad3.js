import{_ as n,c as s,o as a,d as t}from"./app.03d44f5d.js";const y='{"title":"Getting started","description":"","frontmatter":{},"headers":[{"level":2,"title":"docker-compose installation","slug":"docker-compose-installation"},{"level":2,"title":"cloning the repository (for dev)","slug":"cloning-the-repository-for-dev"}],"relativePath":"getting-started.md","lastUpdated":1636457434078}',e={},o=t(`<h1 id="getting-started" tabindex="-1">Getting started <a class="header-anchor" href="#getting-started" aria-hidden="true">#</a></h1><p>To start LocoKit, you can use the docker-compose installation or by cloning the repository.</p><h2 id="docker-compose-installation" tabindex="-1">docker-compose installation <a class="header-anchor" href="#docker-compose-installation" aria-hidden="true">#</a></h2><p>On your host, you&#39;ll have to create a <code>docker-compose.yml</code> file.</p><p>You can download it from</p><p>You can write the following content inside :</p><div class="language-yaml"><pre><code><span class="token comment"># This docker-compose is for testing purpose only</span>
<span class="token comment"># For a deployment, you&#39;ll need to set a mail server</span>
<span class="token comment"># and security with helmet environment variables,</span>
<span class="token comment"># maybe a nginx for serving front and reverse proxy to the api and the file storage.</span>
<span class="token key atrule">version</span><span class="token punctuation">:</span> <span class="token string">&#39;3&#39;</span>
<span class="token key atrule">services</span><span class="token punctuation">:</span>
  <span class="token key atrule">lck-db</span><span class="token punctuation">:</span>
    <span class="token key atrule">image</span><span class="token punctuation">:</span> postgis/postgis<span class="token punctuation">:</span>12<span class="token punctuation">-</span><span class="token number">3.0</span>
    <span class="token key atrule">environment</span><span class="token punctuation">:</span>
      <span class="token key atrule">POSTGRES_DB</span><span class="token punctuation">:</span> public
      <span class="token key atrule">POSTGRES_USER</span><span class="token punctuation">:</span> postgres
      <span class="token key atrule">POSTGRES_PASSWORD</span><span class="token punctuation">:</span> pouicpouic
    <span class="token comment"># restart: always</span>
    <span class="token key atrule">volumes</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> lck<span class="token punctuation">-</span>db<span class="token punctuation">-</span>data<span class="token punctuation">:</span>/var/lib/postgresql/data
      <span class="token punctuation">-</span> ./dumps<span class="token punctuation">:</span>/dumps
    <span class="token key atrule">container_name</span><span class="token punctuation">:</span> lck<span class="token punctuation">-</span>db

  <span class="token key atrule">lck-mail</span><span class="token punctuation">:</span>
    <span class="token key atrule">image</span><span class="token punctuation">:</span> mailhog/mailhog<span class="token punctuation">:</span>latest
    <span class="token key atrule">environment</span><span class="token punctuation">:</span>
      <span class="token key atrule">MH_STORAGE</span><span class="token punctuation">:</span> maildir
      <span class="token key atrule">MH_MAILDIR_PATH</span><span class="token punctuation">:</span> /home/mailhog
    <span class="token key atrule">volumes</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> mailhog<span class="token punctuation">:</span>/home/mailhog/
    <span class="token key atrule">ports</span><span class="token punctuation">:</span>
      <span class="token comment"># - 1025:1025</span>
      <span class="token punctuation">-</span> 8025<span class="token punctuation">:</span><span class="token number">8025</span>
    <span class="token key atrule">container_name</span><span class="token punctuation">:</span> lck<span class="token punctuation">-</span>mail

  <span class="token key atrule">lck-platform</span><span class="token punctuation">:</span>
    <span class="token key atrule">image</span><span class="token punctuation">:</span> locokit/locokit<span class="token punctuation">:</span>0.6.0
    <span class="token key atrule">environment</span><span class="token punctuation">:</span>
      <span class="token key atrule">LCK_PORT</span><span class="token punctuation">:</span> <span class="token string">&quot;8002&quot;</span>
      <span class="token key atrule">LCK_HOST</span><span class="token punctuation">:</span> localhost
      <span class="token key atrule">LCK_PUBLIC_URL</span><span class="token punctuation">:</span> http<span class="token punctuation">:</span>//localhost<span class="token punctuation">:</span><span class="token number">8002</span>
      <span class="token key atrule">LCK_PUBLIC_PORTAL_NAME</span><span class="token punctuation">:</span> Locokit
      <span class="token key atrule">LCK_AUTH_SECRET</span><span class="token punctuation">:</span> putYourAuthSecretHereAndChangeItPlease<span class="token tag">!</span>
      <span class="token key atrule">LCK_DATABASE_URL</span><span class="token punctuation">:</span> postgres<span class="token punctuation">:</span>//postgres<span class="token punctuation">:</span>pouicpouic@lck<span class="token punctuation">-</span>db<span class="token punctuation">:</span>5432/public
      <span class="token key atrule">OBJECTION_DEBUG</span><span class="token punctuation">:</span> <span class="token string">&quot;false&quot;</span>

      <span class="token key atrule">MAIL_PORT</span><span class="token punctuation">:</span> <span class="token string">&quot;1025&quot;</span>
      <span class="token key atrule">MAIL_SERVER</span><span class="token punctuation">:</span> lck<span class="token punctuation">-</span>mail
      <span class="token key atrule">MAIL_DEFAULT_FROM</span><span class="token punctuation">:</span> contact@locokit.io
      <span class="token key atrule">MAIL_SECURE</span><span class="token punctuation">:</span> <span class="token string">&quot;false&quot;</span>

      <span class="token key atrule">CORS_ORIGIN</span><span class="token punctuation">:</span> <span class="token string">&quot;*&quot;</span>

      <span class="token comment"># Signup keys</span>
      <span class="token comment"># Is the signup allowed on the LocoKit platform</span>
      <span class="token comment"># This will display a signup form in the front,</span>
      <span class="token comment"># and the signup endpoint will be registered</span>
      <span class="token key atrule">SIGNUP_ALLOWED</span><span class="token punctuation">:</span> <span class="token string">&quot;true&quot;</span>
      <span class="token comment"># How many tries are authorized</span>
      <span class="token key atrule">SIGNUP_RATE_LIMIT_MAX</span><span class="token punctuation">:</span> <span class="token string">&quot;5&quot;</span>
      <span class="token comment"># Within a time frame of xxx milliseconds</span>
      <span class="token comment"># If more than 5 signup during 60s</span>
      <span class="token comment"># signups will be rejected with a 429 HTTP (TooManyRequests)</span>
      <span class="token key atrule">SIGNUP_RATE_LIMIT_TIMEFRAME</span><span class="token punctuation">:</span> <span class="token string">&quot;60000&quot;</span>

      <span class="token key atrule">HELMET_ENABLED</span><span class="token punctuation">:</span> <span class="token string">&quot;false&quot;</span>
      <span class="token key atrule">HELMET_HSTS</span><span class="token punctuation">:</span> <span class="token string">&quot;false&quot;</span>

      <span class="token comment"># Storage keys</span>
      <span class="token comment"># type can be one of : s3 (s3 compatible object storage), fs (file system)</span>
      <span class="token key atrule">STORAGE_TYPE</span><span class="token punctuation">:</span> fs
      <span class="token comment"># public path can be one of : /s3-storage (s3 compatible object storage), /fs-storage (file system)</span>
      <span class="token comment"># these paths depend on your configuration (nginx or other)</span>
      <span class="token key atrule">STORAGE_PUBLIC_PATH</span><span class="token punctuation">:</span> /fs<span class="token punctuation">-</span>storage
      <span class="token key atrule">STORAGE_FS_PATH</span><span class="token punctuation">:</span> ./fs<span class="token punctuation">-</span>storage
      <span class="token key atrule">STORAGE_MAX_UPLOAD_SIZE</span><span class="token punctuation">:</span> 20mb
    <span class="token key atrule">ports</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token string">&quot;8002:8002&quot;</span>
    <span class="token key atrule">depends_on</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> lck<span class="token punctuation">-</span>mail
    <span class="token key atrule">container_name</span><span class="token punctuation">:</span> lck<span class="token punctuation">-</span>platform
    <span class="token key atrule">volumes</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> lck<span class="token punctuation">-</span>fs<span class="token punctuation">-</span>storage<span class="token punctuation">:</span>/code/fs<span class="token punctuation">-</span>storage/

<span class="token key atrule">volumes</span><span class="token punctuation">:</span>
  <span class="token key atrule">lck-db-data</span><span class="token punctuation">:</span>
  <span class="token key atrule">mailhog</span><span class="token punctuation">:</span>
  <span class="token key atrule">lck-fs-storage</span><span class="token punctuation">:</span>
</code></pre></div><p>The LCK platform is compose of several packages :</p><ul><li>backend <ul><li>several docker images (the API based on Feathers, the db based on PostGreSQL, ...)</li></ul></li><li>frontend <ul><li>the generic build is archived</li><li>for a custom build, you&#39;ll need to enhance visuals from the build, or the theme</li></ul></li><li>client library (node + browser) <ul><li>based on the FeathersJS client</li><li>includes the typings of the platform (User, Group, Permission, Workspace, ...)</li><li>and several methods already wired to the backend for starting more quickly</li><li>not available at this time</li></ul></li></ul><h2 id="cloning-the-repository-for-dev" tabindex="-1">cloning the repository (for dev) <a class="header-anchor" href="#cloning-the-repository-for-dev" aria-hidden="true">#</a></h2>`,10),p=[o];function c(l,u,i,k,r,m){return a(),s("div",null,p)}var h=n(e,[["render",c]]);export{y as __pageData,h as default};
