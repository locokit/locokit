import{_ as n,c as s,o as a,d as p}from"./app.ee1354cf.js";const h='{"title":"Theme","description":"","frontmatter":{},"headers":[{"level":2,"title":"Theme colors","slug":"theme-colors"}],"relativePath":"advanced/theme.md","lastUpdated":1651509259176}',t={},o=p(`<h1 id="theme" tabindex="-1">Theme <a class="header-anchor" href="#theme" aria-hidden="true">#</a></h1><p>LocoKit is provided with a default theme, the <code>locokit</code> theme.</p><p>Themes are available under <code>front/public/themes</code>.</p><p>You could create a new theme by respecting these requirements :</p><p>In development mode</p><ul><li>create a new directory under <code>front/public/themes</code></li><li>inside this directory, <ul><li>one <code>theme.css</code> file, defining all css variables needed by LocoKit</li><li>one <code>theme.js</code> file, defining images for several places in the app</li><li>images this directory, and all assets needed by your theme (fonts, favicon,...)</li></ul></li></ul><p>When this theme is finished, you could deliver this theme in your <code>docker-compose</code> file by binding a volume dedicated to this theme.</p><p>In our container, the <code>/code/public/themes</code> is the directory containing themes.</p><p>You&#39;ll have to build a <code>index.html</code> too, referencing the defined theme, with the <code>npm run build:html</code> available in the <code>front</code> directory. By defining environment variables <code>VUE_APP_TITLE</code> and <code>VUE_APP_THEME</code>, your <code>index.html</code> will load your <code>theme.js</code>, <code>theme.css</code>, etc from your theme.</p><h2 id="theme-colors" tabindex="-1">Theme colors <a class="header-anchor" href="#theme-colors" aria-hidden="true">#</a></h2><p>Here is the default theme for LocoKit :</p><div class="language-css"><pre><code><span class="token comment">/**
 * This file is here to allow you overwrite default colors
 * Please define the colors you want to use inside the app
 */</span>
<span class="token selector">:root</span> <span class="token punctuation">{</span>
  <span class="token comment">/* Spacings */</span>
  <span class="token property">--spacing-xs</span><span class="token punctuation">:</span> .25rem<span class="token punctuation">;</span>
  <span class="token property">--spacing-sm</span><span class="token punctuation">:</span> .5rem<span class="token punctuation">;</span>
  <span class="token property">--spacing</span><span class="token punctuation">:</span> .75rem<span class="token punctuation">;</span>
  <span class="token property">--spacing-lg</span><span class="token punctuation">:</span> 1rem<span class="token punctuation">;</span>
  <span class="token property">--spacing-xl</span><span class="token punctuation">:</span> 2rem<span class="token punctuation">;</span>

  <span class="token comment">/* Borders */</span>
  <span class="token property">--border-color</span><span class="token punctuation">:</span> #ced4da<span class="token punctuation">;</span>
  <span class="token property">--table-border-color</span><span class="token punctuation">:</span> #e9ecef<span class="token punctuation">;</span>
  <span class="token property">--border</span><span class="token punctuation">:</span> 1px solid <span class="token function">var</span><span class="token punctuation">(</span>--border-color<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token property">--border-radius</span><span class="token punctuation">:</span> 4px<span class="token punctuation">;</span>

  <span class="token comment">/* Fonts */</span>
  <span class="token property">--font-family</span><span class="token punctuation">:</span> <span class="token string">&#39;Raleway&#39;</span><span class="token punctuation">,</span> -apple-system<span class="token punctuation">,</span> BlinkMacSystemFont<span class="token punctuation">,</span> Segoe UI<span class="token punctuation">,</span> Roboto<span class="token punctuation">,</span> Helvetica<span class="token punctuation">,</span> Arial<span class="token punctuation">,</span> sans-serif<span class="token punctuation">,</span> Apple Color Emoji<span class="token punctuation">,</span> Segoe UI Emoji<span class="token punctuation">,</span> Segoe UI Symbol<span class="token punctuation">;</span>

  <span class="token comment">/* 12px */</span>
  <span class="token property">--font-size-sm</span><span class="token punctuation">:</span> 0.75rem<span class="token punctuation">;</span>
  <span class="token comment">/* 14px */</span>
  <span class="token property">--font-size-md</span><span class="token punctuation">:</span> 0.875rem<span class="token punctuation">;</span>
  <span class="token comment">/* 16px */</span>
  <span class="token property">--font-size-lg</span><span class="token punctuation">:</span> 1rem<span class="token punctuation">;</span>
  <span class="token comment">/* 20px */</span>
  <span class="token property">--font-size-xl</span><span class="token punctuation">:</span> 1.25rem<span class="token punctuation">;</span>

  <span class="token property">--font-weight-light</span><span class="token punctuation">:</span> 300<span class="token punctuation">;</span>
  <span class="token property">--font-weight-regular</span><span class="token punctuation">:</span> 400<span class="token punctuation">;</span>
  <span class="token property">--font-weight-medium</span><span class="token punctuation">:</span> 500<span class="token punctuation">;</span>
  <span class="token property">--font-weight-bold</span><span class="token punctuation">:</span> 700<span class="token punctuation">;</span>

  <span class="token comment">/* Colors */</span>
  <span class="token property">--color-white</span><span class="token punctuation">:</span> #fff<span class="token punctuation">;</span>
  <span class="token property">--color-black</span><span class="token punctuation">:</span> #1f1e1e<span class="token punctuation">;</span>
  <span class="token property">--color-grey-light</span><span class="token punctuation">:</span> #f1f1f1<span class="token punctuation">;</span>

  <span class="token property">--color-warning</span><span class="token punctuation">:</span> #f7a603<span class="token punctuation">;</span>
  <span class="token property">--color-warning-lighten</span><span class="token punctuation">:</span> #f7f2e9<span class="token punctuation">;</span>
  <span class="token property">--color-warning-light</span><span class="token punctuation">:</span> #fcca6e<span class="token punctuation">;</span>
  <span class="token property">--color-warning-dark</span><span class="token punctuation">:</span> #a86500<span class="token punctuation">;</span>

  <span class="token property">--color-error</span><span class="token punctuation">:</span> #f44336<span class="token punctuation">;</span>
  <span class="token property">--color-error-lighten</span><span class="token punctuation">:</span> #f7e5e4<span class="token punctuation">;</span>
  <span class="token property">--color-error-light</span><span class="token punctuation">:</span> #f37971<span class="token punctuation">;</span>
  <span class="token property">--color-error-dark</span><span class="token punctuation">:</span> #94251d<span class="token punctuation">;</span>

  <span class="token property">--color-success</span><span class="token punctuation">:</span> #289228<span class="token punctuation">;</span>
  <span class="token property">--color-success-lighten</span><span class="token punctuation">:</span> #dcf3dc<span class="token punctuation">;</span>
  <span class="token property">--color-success-light</span><span class="token punctuation">:</span> #c0e0c0<span class="token punctuation">;</span>
  <span class="token property">--color-success-dark</span><span class="token punctuation">:</span> #1a6d1a<span class="token punctuation">;</span>

  <span class="token property">--primary-color</span><span class="token punctuation">:</span> #29264F<span class="token punctuation">;</span>
  <span class="token property">--primary-color-lighten</span><span class="token punctuation">:</span> #f0f0fa<span class="token punctuation">;</span>
  <span class="token property">--primary-color-light</span><span class="token punctuation">:</span> #9997b4<span class="token punctuation">;</span>
  <span class="token property">--primary-color-dark</span><span class="token punctuation">:</span> #121031<span class="token punctuation">;</span>

  <span class="token property">--secondary-color</span><span class="token punctuation">:</span> #4b9c6d<span class="token punctuation">;</span>
  <span class="token property">--secondary-color-lighten</span><span class="token punctuation">:</span> #eaf7ef<span class="token punctuation">;</span>
  <span class="token property">--secondary-color-light</span><span class="token punctuation">:</span> #ccddd3<span class="token punctuation">;</span>
  <span class="token property">--secondary-color-dark</span><span class="token punctuation">:</span> #243029<span class="token punctuation">;</span>


  <span class="token comment">/* Background color, main content */</span>
  <span class="token property">--background-color</span><span class="token punctuation">:</span> #fafafa<span class="token punctuation">;</span>

  <span class="token comment">/* Text Color */</span>
  <span class="token property">--text-color</span><span class="token punctuation">:</span> #495057<span class="token punctuation">;</span>

  <span class="token comment">/* Admin Sidebar */</span>
  <span class="token property">--sidebar-width</span><span class="token punctuation">:</span> 18rem<span class="token punctuation">;</span>
  <span class="token property">--sidebar-background-color</span><span class="token punctuation">:</span> <span class="token function">var</span><span class="token punctuation">(</span>--primary-color-lighten<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token property">--sidebar-text-color</span><span class="token punctuation">:</span> <span class="token function">var</span><span class="token punctuation">(</span>--primary-color-dark<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token property">--sidebar-text-color-active</span><span class="token punctuation">:</span> <span class="token function">var</span><span class="token punctuation">(</span>--primary-color-dark<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token property">--sidebar-link-hover</span><span class="token punctuation">:</span> <span class="token function">var</span><span class="token punctuation">(</span>--primary-color<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">/* App Sidebar */</span>
  <span class="token property">--sidebar-app-width</span><span class="token punctuation">:</span> <span class="token function">var</span><span class="token punctuation">(</span>--sidebar-width<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token property">--sidebar-app-background-color</span><span class="token punctuation">:</span> <span class="token function">var</span><span class="token punctuation">(</span>--primary-color<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token property">--sidebar-app-text-color</span><span class="token punctuation">:</span> white<span class="token punctuation">;</span>
  <span class="token property">--sidebar-app-text-color-active</span><span class="token punctuation">:</span> white<span class="token punctuation">;</span>
  <span class="token property">--sidebar-app-link-hover</span><span class="token punctuation">:</span> <span class="token function">var</span><span class="token punctuation">(</span>--primary-color-light<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">/* Main Header */</span>
  <span class="token property">--header-height</span><span class="token punctuation">:</span> 4rem<span class="token punctuation">;</span>
  <span class="token property">--header-background-color</span><span class="token punctuation">:</span> #FAF9F9<span class="token punctuation">;</span>
  <span class="token property">--header-border-bottom-color</span><span class="token punctuation">:</span> #cccccc<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre></div>`,12),e=[o];function c(l,r,u,i,k,d){return a(),s("div",null,e)}var y=n(t,[["render",c]]);export{h as __pageData,y as default};
